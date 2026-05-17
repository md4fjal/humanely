"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks";
import { useUpdateProfile, useResetData } from "@/features/user/hooks";

export default function SettingsPage() {
  const router = useRouter();
  const { data: authData } = useAuth();
  const { mutate: updateProfile, isPending: updating } = useUpdateProfile();
  const { mutate: resetData, isPending: resetting } = useResetData();

  const [name, setName] = useState(authData?.user?.name || "");
  const [confirmReset, setConfirmReset] = useState(false);

  function handleSaveName() {
    if (name.trim() && name.trim() !== authData?.user?.name) {
      updateProfile(name.trim());
    }
  }

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "#7A7690", cursor: "pointer", display: "flex" }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-serif" style={{ fontSize: 24, fontWeight: 500, color: "#EDE9DF" }}>
          Settings
        </h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-card" style={{ padding: 20, marginBottom: 16 }}>
        <p className="section-label" style={{ marginBottom: 16 }}>Your Name</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            className="h-input font-serif"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ fontSize: 18, fontStyle: "italic", padding: "10px 14px", flex: 1 }}
            placeholder="What should we call you?"
          />
          <button
            className="btn-ghost"
            onClick={handleSaveName}
            disabled={updating || name.trim() === authData?.user?.name}
            style={{ padding: "10px 20px" }}
          >
            {updating ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="h-card" style={{ padding: 20, marginBottom: 16 }}>
        <p className="section-label" style={{ marginBottom: 16 }}>Philosophy</p>
        <p className="font-serif" style={{ fontSize: 16, fontStyle: "italic", color: "#7A7690", lineHeight: 1.7, margin: 0 }}>
          Humanely is not a judge. It is a mirror. The goal is never to label you as good or bad — it is to illuminate the gap between who you are and who you intend to be, with compassion and curiosity.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-card" style={{ padding: 20, marginBottom: 16 }}>
        <p className="section-label" style={{ marginBottom: 16 }}>Data & Privacy</p>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#7A7690", lineHeight: 1.6, marginBottom: 20 }}>
          All your daily logs are stored securely. The AI reflection feature sends only your day's actions and intention securely to the language model — no personal information is included.
        </p>

        {!confirmReset ? (
          <button
            className="btn-ghost"
            onClick={() => setConfirmReset(true)}
            style={{ width: "100%", color: "#C85E5E", borderColor: "rgba(200,94,94,0.3)" }}
          >
            Reset all daily logs
          </button>
        ) : (
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost" onClick={() => setConfirmReset(false)} style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              className="btn-gold"
              onClick={() => {
                resetData();
                setConfirmReset(false);
              }}
              disabled={resetting}
              style={{ flex: 1, background: "linear-gradient(135deg, #C85E5E, #a34b4b)", color: "#FFF" }}
            >
              {resetting ? "Resetting..." : "Yes, reset data"}
            </button>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-card" style={{ padding: 20 }}>
        <p className="section-label" style={{ marginBottom: 16 }}>About</p>
        <h3 className="font-serif" style={{ fontSize: 24, color: "#C8973A", marginBottom: 8, fontWeight: 500 }}>
          Humanely
        </h3>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#7A7690", lineHeight: 1.6, margin: 0 }}>
          A self-awareness platform · AI conscience assistant · Digital morality journal. Built on one question: How humanely are you living?
        </p>
      </motion.div>
    </div>
  );
}
