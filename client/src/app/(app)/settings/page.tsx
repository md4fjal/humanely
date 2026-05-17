"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks";
import { useUpdateProfile, useResetData, useChangePassword } from "@/features/user/hooks";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: authData } = useAuth();
  const { mutate: updateProfile, isPending: updating } = useUpdateProfile();
  const { mutate: resetData, isPending: resetting } = useResetData();

  const [name, setName] = useState(authData?.user?.name || "");
  const [confirmReset, setConfirmReset] = useState(false);

  const { mutate: changePassword, isPending: changingPassword } = useChangePassword();
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = () => {
    if (passwordForm.oldPassword && passwordForm.newPassword) {
      changePassword(passwordForm, {
        onSuccess: () => setPasswordForm({ oldPassword: "", newPassword: "" })
      });
    }
  };

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

      {authData?.user?.authProvider !== "google" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="h-card" style={{ padding: 20, marginBottom: 16 }}>
          <p className="section-label" style={{ marginBottom: 16 }}>Change Password</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ position: "relative" }}>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="h-input font-serif"
                  placeholder="Current Password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  style={{ fontSize: 16, padding: "10px 14px", width: "100%", paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7A7690", cursor: "pointer", display: "flex" }}
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="h-input font-serif"
                  placeholder="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  style={{ fontSize: 16, padding: "10px 14px", width: "100%", paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7A7690", cursor: "pointer", display: "flex" }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#7A7690", marginTop: 6, fontFamily: "DM Sans, sans-serif" }}>
                Must be at least 8 characters long and contain at least one letter and one number.
              </p>
            </div>
            <button
              className="btn-ghost"
              onClick={handleChangePassword}
              disabled={changingPassword || !passwordForm.oldPassword || !passwordForm.newPassword}
              style={{ padding: "10px 20px", alignSelf: "flex-start" }}
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </motion.div>
      )}

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
