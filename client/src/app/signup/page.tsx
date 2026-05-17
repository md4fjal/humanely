"use client";

import { useState } from "react";
import { useSignup, useGoogleLogin, useVerifyOtp } from "@/features/auth/hooks";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).*$/,
      "Password must contain at least one letter and one number",
    ),
  dateOfBirth: z.string().optional(),
});

export default function Signup() {
  const { mutate, isPending, error } = useSignup();
  const { mutate: googleMutate } = useGoogleLogin();
  const {
    mutate: verifyOtpMutate,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyOtp();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });
  const [otp, setOtp] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      signupSchema.parse(form);
      mutate(form, {
        onSuccess: () => {
          setStep(2);
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        err.issues.forEach((e) => {
          if (e.path[0]) {
            errors[e.path[0] as string] = e.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setValidationErrors({ otp: "OTP must be exactly 6 digits" });
      return;
    }
    verifyOtpMutate({ email: form.email, otp });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B0B10",
        position: "relative",
        overflow: "hidden",
        padding: "40px 24px",
      }}
    >
      {/* Background glow */}
      <div
        className="glow-gold"
        style={{
          width: 600,
          height: 600,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="signup-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="h-card"
            style={{
              width: "100%",
              maxWidth: 420,
              padding: 32,
              position: "relative",
              zIndex: 10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <h1
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: "0",
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                border: "0",
              }}
            >
              Sign Up for Ensanit — Start Mindful Daily Reflection & Character Mirroring
            </h1>

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 32,
                  fontWeight: 600,
                  color: "#EDE9DF",
                  marginBottom: 8,
                  lineHeight: 1,
                }}
              >
                Create an account
              </h2>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 14,
                  color: "#7A7690",
                }}
              >
                Join Ensanit to begin your journey
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#7A7690",
                    marginBottom: 6,
                  }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  className="h-input"
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                {validationErrors.name && (
                  <p style={{ color: "#C85E5E", fontSize: 12, marginTop: 4 }}>
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#7A7690",
                    marginBottom: 6,
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  className="h-input"
                  placeholder="e.g. janedoe"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                />
                {validationErrors.username && (
                  <p style={{ color: "#C85E5E", fontSize: 12, marginTop: 4 }}>
                    {validationErrors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#7A7690",
                    marginBottom: 6,
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="h-input"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                {validationErrors.email && (
                  <p style={{ color: "#C85E5E", fontSize: 12, marginTop: 4 }}>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#7A7690",
                    marginBottom: 6,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="h-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#7A7690",
                      cursor: "pointer",
                      display: "flex",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p style={{ color: "#C85E5E", fontSize: 12, marginTop: 4 }}>
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <button type="submit" className="btn-gold" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "4px 0",
                }}
              >
                <div style={{ flex: 1, height: 1, background: "#1E1E2E" }} />
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 12,
                    color: "#4A475E",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Or
                </span>
                <div style={{ flex: 1, height: 1, background: "#1E1E2E" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      googleMutate({ token: credentialResponse.credential });
                    }
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  theme="filled_black"
                  shape="pill"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  marginTop: 20,
                  padding: 12,
                  background: "rgba(200,94,94,0.1)",
                  border: "1px solid rgba(200,94,94,0.2)",
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#C85E5E",
                    fontSize: 13,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Registration failed. Please try again.
                </p>
              </motion.div>
            )}

            <p
              style={{
                textAlign: "center",
                marginTop: 24,
                fontFamily: "DM Sans, sans-serif",
                fontSize: 14,
                color: "#7A7690",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: "#C8973A",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="otp-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onSubmit={handleVerifyOtp}
            className="h-card"
            style={{
              width: "100%",
              maxWidth: 420,
              padding: 32,
              position: "relative",
              zIndex: 10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 32,
                  fontWeight: 600,
                  color: "#EDE9DF",
                  marginBottom: 8,
                  lineHeight: 1,
                }}
              >
                Verify Email
              </h2>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 14,
                  color: "#7A7690",
                }}
              >
                We've sent a 6-digit code to {form.email}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#7A7690",
                    marginBottom: 6,
                  }}
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  className="h-input"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  style={{
                    textAlign: "center",
                    letterSpacing: "0.2em",
                    fontSize: 20,
                  }}
                />
                {validationErrors.otp && (
                  <p style={{ color: "#C85E5E", fontSize: 12, marginTop: 4 }}>
                    {validationErrors.otp}
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <button
                type="submit"
                className="btn-gold"
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>
            </div>

            {verifyError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  marginTop: 20,
                  padding: 12,
                  background: "rgba(200,94,94,0.1)",
                  border: "1px solid rgba(200,94,94,0.2)",
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#C85E5E",
                    fontSize: 13,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Verification failed. Invalid or expired code.
                </p>
              </motion.div>
            )}

            <p
              style={{
                textAlign: "center",
                marginTop: 24,
                fontFamily: "DM Sans, sans-serif",
                fontSize: 14,
                color: "#7A7690",
              }}
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#C8973A",
                  textDecoration: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Back to Signup
              </button>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
