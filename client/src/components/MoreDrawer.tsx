"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Clock, CalendarDays, EyeOff, Settings } from "lucide-react";

interface MoreDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MoreDrawer({ open, onClose }: MoreDrawerProps) {
  const router = useRouter();

  const items = [
    {
      id: "history",
      icon: <Clock size={16} />,
      label: "Timeline",
      sub: "How you've changed over 7 days",
      href: "/history",
    },
    {
      id: "weekly",
      icon: <CalendarDays size={16} />,
      label: "Weekly Summary",
      sub: "AI character review of your week",
      href: "/weekly",
    },
    {
      id: "confession",
      icon: <EyeOff size={16} />,
      label: "Confession Mode",
      sub: "Private, anonymous, deleted in 24h",
      href: "/confession",
    },
    {
      id: "settings",
      icon: <Settings size={16} />,
      label: "Settings",
      sub: "Profile, data, and preferences",
      href: "/settings",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#12121A",
              borderTop: "1px solid #1E1E2E",
              borderRadius: "24px 24px 0 0",
              zIndex: 110,
              padding: "12px 20px 32px",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                background: "#1E1E2E",
                borderRadius: 2,
                margin: "0 auto 24px",
              }}
            />
            
            <p className="section-label" style={{ marginBottom: 16 }}>More options</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    onClose();
                    router.push(it.href);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.2s",
                    color: "#EDE9DF"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "rgba(200,151,58,0.1)",
                      border: "1px solid rgba(200,151,58,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#C8973A",
                      flexShrink: 0,
                    }}
                  >
                    {it.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 500, marginBottom: 2 }}>
                      {it.label}
                    </div>
                    <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#7A7690" }}>
                      {it.sub}
                    </div>
                  </div>
                  <span style={{ color: "#4A475E", fontSize: 20 }}>›</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
