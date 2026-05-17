"use client";

import { useState } from "react";
import { useLogin, useGoogleLogin } from "@/features/auth/hooks";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const { mutate, isPending, error } = useLogin();
  const { mutate: googleMutate } = useGoogleLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
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
      {/* Background glow */}
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

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
            Welcome back
          </h2>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14,
              color: "#7A7690",
            }}
          >
            Enter your credentials to continue
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
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
              Email or Username
            </label>
            <input
              type="text"
              className="h-input"
              placeholder="e.g. johndoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
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
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Link
                href="/forgot-password"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 12,
                  color: "#C8973A",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button type="submit" className="btn-gold" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
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
            <p style={{ color: "#C85E5E", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
              Invalid username or password
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
          Don't have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "#C8973A", textDecoration: "none", fontWeight: 500 }}
          >
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
