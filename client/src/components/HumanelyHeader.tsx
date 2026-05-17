"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { useLog } from "@/features/log/hooks";
import { LogOut, User, X } from "lucide-react";

export default function HumanelyHeader() {
  const { data: authData } = useAuth();
  const { data: log } = useLog();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const [dropOpen, setDropOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const score = log?.humanityScore ?? null;

  function getScoreColor(s: number) {
    if (s >= 75) return "#5BB87A";
    if (s >= 50) return "#C8973A";
    return "#C85E5E";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <header
        style={{
          background: "rgba(11,11,16,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #1E1E2E",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Brand */}
          <div>
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#EDE9DF",
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              Humanely
            </h1>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 11,
                color: "#4A475E",
                marginTop: 2,
                letterSpacing: "0.04em",
              }}
            >
              {today}
            </p>
          </div>

          {/* Right: Score badge + avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} ref={dropRef}>
            {score !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  background: "rgba(200,151,58,0.08)",
                  border: "1px solid rgba(200,151,58,0.2)",
                  borderRadius: 999,
                }}
              >
                <span style={{ color: "#C8973A", fontSize: 10 }}>◎</span>
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: getScoreColor(score),
                  }}
                >
                  {score}
                </span>
              </div>
            )}

            {authData?.user && (
              <button
                onClick={() => setDropOpen((p) => !p)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1E1E2E, #12121A)",
                  border: "1px solid #2A2A3E",
                  color: "#C8973A",
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {authData.user.name?.[0]?.toUpperCase() ||
                  authData.user.username?.[0]?.toUpperCase() ||
                  "?"}
              </button>
            )}

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 20,
                    marginTop: 8,
                    width: 200,
                    background: "#12121A",
                    border: "1px solid #1E1E2E",
                    borderRadius: 12,
                    overflow: "hidden",
                    zIndex: 100,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <div style={{ padding: 8 }}>
                    <button
                      onClick={() => {
                        setDropOpen(false);
                        setProfileOpen(true);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: 8,
                        color: "#7A7690",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 14,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#EDE9DF";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = "#7A7690";
                      }}
                    >
                      <User size={14} />
                      Profile
                    </button>
                    <div style={{ height: 1, background: "#1E1E2E", margin: "4px 0" }} />
                    <button
                      onClick={() => {
                        setDropOpen(false);
                        logout();
                      }}
                      disabled={loggingOut}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: 8,
                        color: "#C85E5E",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 14,
                        cursor: "pointer",
                        textAlign: "left",
                        opacity: loggingOut ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,94,94,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      <LogOut size={14} />
                      {loggingOut ? "Leaving..." : "Sign out"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <AnimatePresence>
        {profileOpen && authData?.user && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
              onClick={() => setProfileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 360,
                background: "#12121A",
                border: "1px solid #1E1E2E",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#EDE9DF" }}>
                    Your Profile
                  </h2>
                  <button
                    onClick={() => setProfileOpen(false)}
                    style={{ background: "none", border: "none", color: "#4A475E", cursor: "pointer", padding: 4 }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(200,151,58,0.15), rgba(91,184,122,0.1))",
                      border: "2px solid rgba(200,151,58,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: 32,
                      fontWeight: 600,
                      color: "#C8973A",
                    }}
                  >
                    {authData.user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#EDE9DF" }}>
                      {authData.user.name || authData.user.username}
                    </p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#4A475E", marginTop: 4 }}>
                      {authData.user.email}
                    </p>
                  </div>
                  {score !== null && (
                    <div
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        background: "rgba(200,151,58,0.06)",
                        border: "1px solid rgba(200,151,58,0.15)",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#7A7690" }}>
                        Today's Humanity Score
                      </span>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: getScoreColor(score) }}>
                        {score}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
