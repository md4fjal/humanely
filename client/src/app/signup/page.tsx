"use client";

import { useState } from "react";
import { useSignup, useGoogleLogin } from "@/features/auth/hooks";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const { mutate, isPending, error } = useSignup();
  const { mutate: googleMutate } = useGoogleLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });

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
            Create an account
          </h2>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14,
              color: "#7A7690",
            }}
          >
            Join Humanely to begin your journey
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
    </div>
  );
}
