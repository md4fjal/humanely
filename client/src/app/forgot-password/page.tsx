"use client";

import { useState } from "react";
import { useForgotPassword } from "@/features/auth/hooks";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const { mutate, isPending } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email }, {
      onSuccess: () => setSubmitted(true),
    });
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
        padding: 24,
      }}
    >
      <div
        className="glow-gold"
        style={{
          width: 500,
          height: 500,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
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
            Reset Password
          </h2>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14,
              color: "#7A7690",
            }}
          >
            Enter your email to receive a reset link
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ color: "#EDE9DF", marginBottom: 24, fontFamily: "DM Sans, sans-serif", lineHeight: 1.6 }}>
              If an account exists for <strong>{email}</strong>, we have sent a password reset link to it.
            </p>
            <Link href="/login" className="btn-ghost" style={{ display: "inline-block", textDecoration: "none" }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
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
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-gold" disabled={isPending} style={{ width: "100%", marginBottom: 16 }}>
              {isPending ? "Sending link..." : "Send Reset Link"}
            </button>

            <div style={{ textAlign: "center" }}>
              <Link href="/login" style={{ color: "#7A7690", textDecoration: "none", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
