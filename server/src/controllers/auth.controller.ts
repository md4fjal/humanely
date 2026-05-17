import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
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
      return res.status(400).json({ message: "User or email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashed,
      dateOfBirth,
    });

    return res.status(201).json({ message: "User signed up" });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
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
