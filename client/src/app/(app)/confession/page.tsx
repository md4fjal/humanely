"use client";

import { useState } from "react";
import { ArrowLeft, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ConfessionPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [cleared, setCleared] = useState(false);

  function clear() {
    setText("");
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
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
          Private Space
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-card-red"
        style={{ padding: 16, marginBottom: 20 }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <EyeOff size={18} color="#C85E5E" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#C85E5E", opacity: 0.9, lineHeight: 1.6 }}>
            Nothing typed here is logged, scored, or sent to AI. This space is completely yours — it disappears when you leave this page and is never saved anywhere.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="h-card"
        style={{ minHeight: 280, padding: 20, marginBottom: 16, position: "relative" }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write anything here. Say what you can't say out loud. Be completely honest. This stays between you and you..."
          style={{
            background: "none",
            border: "none",
            outline: "none",
            width: "100%",
            minHeight: 250,
            resize: "none",
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 18,
            fontStyle: "italic",
            color: text ? "#EDE9DF" : "#4A475E",
            lineHeight: 1.8,
          }}
        />
        {text && (
          <span style={{ position: "absolute", bottom: 12, right: 16, fontSize: 11, color: "#4A475E", fontFamily: "DM Sans, sans-serif" }}>
            {text.length} chars
          </span>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: "flex", gap: 12, marginBottom: 20 }}
      >
        <button className="btn-ghost" onClick={clear} style={{ flex: 1, padding: 14 }}>
          {cleared ? "Cleared ✓" : "Clear"}
        </button>
        <button
          className="btn-gold"
          onClick={clear}
          style={{
            flex: 2,
            padding: 14,
            background: "linear-gradient(135deg, #C85E5E, #a34b4b)",
            color: "#FFF",
          }}
        >
          Delete Permanently
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          textAlign: "center",
          fontFamily: "DM Sans, sans-serif",
          fontSize: 11,
          color: "#4A475E",
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        Never backed up · Never read by anyone · Session only
      </motion.p>
    </div>
  );
}
