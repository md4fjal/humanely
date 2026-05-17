"use client";

import { useState, useEffect, Suspense } from "react";
import { useResetPassword } from "@/features/auth/hooks";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function ResetPasswordForm() {
  const { mutate, isPending } = useResetPassword();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      mutate({ token, password });
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#C85E5E", marginBottom: 24, fontFamily: "DM Sans, sans-serif" }}>
          Invalid or missing reset token.
        </p>
        <Link href="/forgot-password" className="btn-ghost" style={{ display: "inline-block", textDecoration: "none" }}>
          Request a new link
        </Link>
      </div>
    );
  }

  return (
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
          New Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className="h-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
        <p style={{ fontSize: 12, color: "#7A7690", marginTop: 6, fontFamily: "DM Sans, sans-serif" }}>
          Must be at least 8 characters long and contain at least one letter and one number.
        </p>
      </div>

      <button type="submit" className="btn-gold" disabled={isPending} style={{ width: "100%" }}>
        {isPending ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
            Create New Password
          </h2>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14,
              color: "#7A7690",
            }}
          >
            Please enter your new password below
          </p>
        </div>

        <Suspense fallback={<p style={{ color: "#7A7690", textAlign: "center" }}>Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
