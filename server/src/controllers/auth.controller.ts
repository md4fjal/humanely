import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { sendEmail, sendOtpVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "../utils/email.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, dateOfBirth } = req.body;

    const existing = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existing) {
      if (!existing.isVerified && existing.email === email) {
         // Optionally, we could resend OTP here if they try to signup again,
         // but for simplicity, we'll just delete the old unverified account and recreate,
         // or we can just block it. Let's delete it if unverified to allow retry.
         await User.deleteOne({ _id: existing._id });
      } else {
        return res.status(400).json({ message: "User or email already exists" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    const user = await User.create({
      name,
      username,
      email,
      password: hashed,
      dateOfBirth,
      isVerified: false,
      verificationOtp: otp,
      verificationOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await sendOtpVerificationEmail(email, otp, name);

    return res.status(201).json({ message: "User registered. Please verify your email with the OTP sent." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (
      user.verificationOtp !== otp ||
      !user.verificationOtpExpiresAt ||
      user.verificationOtpExpiresAt.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpiresAt = undefined;

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    // Send welcome email after successful verification
    await sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email address before logging in." });
    }

    const match = await bcrypt.compare(password, user.password!);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Also send access token in header
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

// REFRESH TOKEN
export const refresh = async (req: Request, res: Response) => {
  console.log("------- REFRESH API HIT -------");
  try {
    const token = req.cookies.refreshToken;
    console.log("Cookies received:", req.cookies);

    if (!token) {
      console.log("FAIL: No refresh token in cookies.");
      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      return res.status(401).json({ message: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as { userId: string };
    } catch (jwtErr) {
      console.log("FAIL: JWT verification failed for refresh token:", jwtErr);
      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.userId).select("+refreshToken");
    if (!user) {
      console.log("FAIL: User not found in database for id:", decoded.userId);
      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (user.refreshToken !== token) {
      console.log("FAIL: Token mismatch!");
      console.log("DB Token:", user.refreshToken);
      console.log("Cookie Token:", token);
      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id.toString());

    res.cookie("accessToken", newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);

    console.log("SUCCESS: Access Token refreshed for user:", user.username);
    return res.status(200).json({ message: "Token refreshed" });
  } catch (unknownErr) {
    console.log("FAIL: Unknown error in refresh route:", unknownErr);
    res.clearCookie("accessToken", COOKIE_OPTIONS);
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({ message: "Logged out successfully" });
};

// GOOGLE LOGIN
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user for Google login
      // We generate a username based on email or name
      const baseUsername =
        email?.split("@")[0] ||
        name?.replace(/\s+/g, "").toLowerCase() ||
        "user";
      let uniqueUsername = baseUsername;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        name: name || "Google User",
        email,
        username: uniqueUsername,
        googleId,
        authProvider: "google",
        isVerified: true,
      });
    } else {
      // If user exists but no googleId, link the account
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
      }
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({ message: "Google login successful" });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({ message: "This account uses Google login. Password reset is not available." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token for saving in DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    user.passwordResetToken = hashedToken;
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Failed to process forgot password request" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Hash token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Password has been successfully reset. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};
