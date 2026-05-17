"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLog, useAddAction, useRemoveAction } from "@/features/log/hooks";
import { Plus, X, Check } from "lucide-react";

const POSITIVE_PRESETS = [
  "Helped someone",
  "Exercised",
  "Meditated",
  "Apologized",
  "Was honest",
  "Showed kindness",
  "Listened well",
  "Kept a promise",
  "Expressed gratitude",
  "Stayed calm",
  "Volunteered",
  "Checked on a friend",
];

const NEGATIVE_PRESETS = [
  "Lost patience",
  "Lied",
  "Was unkind",
  "Broke a promise",
  "Procrastinated",
  "Reacted in anger",
  "Was selfish",
  "Disrespected someone",
  "Avoided responsibility",
  "Acted impulsively",
];

export default function LogPage() {
  const { data: log } = useLog();
  const { mutate: addAction, isPending: adding } = useAddAction();
  const { mutate: removeAction } = useRemoveAction();

  const [customPositive, setCustomPositive] = useState("");
  const [customNegative, setCustomNegative] = useState("");
  const [showCustomPositive, setShowCustomPositive] = useState(false);
  const [showCustomNegative, setShowCustomNegative] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const positiveActions = log?.actions.filter((a) => a.type === "positive") ?? [];
  const negativeActions = log?.actions.filter((a) => a.type === "negative") ?? [];
  const allActions = [...(log?.actions ?? [])].reverse();

  function handleAdd(label: string, type: "positive" | "negative") {
    addAction({ label, type });
    setLastAdded(label);
    setTimeout(() => setLastAdded(null), 1000);
  }

  function handleCustomAdd(type: "positive" | "negative") {
    const val = type === "positive" ? customPositive.trim() : customNegative.trim();
    if (!val) return;
    handleAdd(val, type);
    if (type === "positive") {
      setCustomPositive("");
      setShowCustomPositive(false);
    } else {
      setCustomNegative("");
      setShowCustomNegative(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Positive Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ color: "#5BB87A", fontSize: 14 }}>✓</span>
          <p className="section-label" style={{ color: "#5BB87A" }}>
            Moments of Growth
          </p>
        </div>

        <div className="h-card-green" style={{ padding: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {POSITIVE_PRESETS.map((label) => {
              const count = log?.actions.filter(
                (a) => a.label === label && a.type === "positive"
              ).length ?? 0;
              return (
                <button
                  key={label}
                  onClick={() => handleAdd(label, "positive")}
                  disabled={adding}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 13px",
                    background:
                      count > 0
                        ? "rgba(91,184,122,0.2)"
                        : "rgba(91,184,122,0.06)",
                    border: `1px solid ${count > 0 ? "rgba(91,184,122,0.5)" : "rgba(91,184,122,0.15)"}`,
                    borderRadius: 999,
                    color: count > 0 ? "#5BB87A" : "#7A7690",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  {count > 0 && (
                    <Check size={11} style={{ color: "#5BB87A" }} />
                  )}
                  {label}
                  {count > 1 && (
                    <span
                      style={{
                        background: "rgba(91,184,122,0.3)",
                        color: "#5BB87A",
                        borderRadius: 999,
                        padding: "0 5px",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ×{count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom chip */}
            {showCustomPositive ? (
              <div style={{ display: "flex", gap: 6, width: "100%", marginTop: 4 }}>
                <input
                  autoFocus
                  className="h-input"
                  value={customPositive}
                  onChange={(e) => setCustomPositive(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCustomAdd("positive");
                    if (e.key === "Escape") setShowCustomPositive(false);
                  }}
                  placeholder="Describe what you did..."
                  style={{ flex: 1, fontSize: 13, padding: "8px 12px" }}
                />
                <button
                  onClick={() => handleCustomAdd("positive")}
                  style={{
                    padding: "0 12px",
                    background: "rgba(91,184,122,0.2)",
                    border: "1px solid rgba(91,184,122,0.3)",
                    borderRadius: 10,
                    color: "#5BB87A",
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowCustomPositive(false)}
                  style={{ background: "none", border: "none", color: "#4A475E", cursor: "pointer" }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomPositive(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 13px",
                  background: "transparent",
                  border: "1px dashed rgba(91,184,122,0.25)",
                  borderRadius: 999,
                  color: "#4A475E",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                <Plus size={12} />
                Custom
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Negative Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ color: "#C85E5E", fontSize: 14 }}>✕</span>
          <p className="section-label" style={{ color: "#C85E5E" }}>
            Moments to Learn From
          </p>
        </div>

        <div className="h-card-red" style={{ padding: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {NEGATIVE_PRESETS.map((label) => {
              const count = log?.actions.filter(
                (a) => a.label === label && a.type === "negative"
              ).length ?? 0;
              return (
                <button
                  key={label}
                  onClick={() => handleAdd(label, "negative")}
                  disabled={adding}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 13px",
                    background:
                      count > 0
                        ? "rgba(200,94,94,0.15)"
                        : "rgba(200,94,94,0.05)",
                    border: `1px solid ${count > 0 ? "rgba(200,94,94,0.4)" : "rgba(200,94,94,0.12)"}`,
                    borderRadius: 999,
                    color: count > 0 ? "#C85E5E" : "#7A7690",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  {label}
                  {count > 0 && (
                    <span
                      style={{
                        background: "rgba(200,94,94,0.2)",
                        color: "#C85E5E",
                        borderRadius: 999,
                        padding: "0 5px",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ×{count}
                    </span>
                  )}
                </button>
              );
            })}

            {showCustomNegative ? (
              <div style={{ display: "flex", gap: 6, width: "100%", marginTop: 4 }}>
                <input
                  autoFocus
                  className="h-input"
                  value={customNegative}
                  onChange={(e) => setCustomNegative(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCustomAdd("negative");
                    if (e.key === "Escape") setShowCustomNegative(false);
                  }}
                  placeholder="What happened..."
                  style={{ flex: 1, fontSize: 13, padding: "8px 12px" }}
                />
                <button
                  onClick={() => handleCustomAdd("negative")}
                  style={{
                    padding: "0 12px",
                    background: "rgba(200,94,94,0.15)",
                    border: "1px solid rgba(200,94,94,0.25)",
                    borderRadius: 10,
                    color: "#C85E5E",
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowCustomNegative(false)}
                  style={{ background: "none", border: "none", color: "#4A475E", cursor: "pointer" }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomNegative(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 13px",
                  background: "transparent",
                  border: "1px dashed rgba(200,94,94,0.2)",
                  borderRadius: 999,
                  color: "#4A475E",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                <Plus size={12} />
                Custom
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Today's Summary */}
      <AnimatePresence>
        {allActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-card"
            style={{ padding: 20 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p className="section-label">Today's Log</p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#4A475E" }}>
                <span style={{ color: "#5BB87A" }}>{positiveActions.length} growth</span>
                {" · "}
                <span style={{ color: "#C85E5E" }}>{negativeActions.length} to learn</span>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allActions.map((action) => (
                <motion.div
                  key={action._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: action.type === "positive"
                      ? "rgba(91,184,122,0.05)"
                      : "rgba(200,94,94,0.05)",
                    border: `1px solid ${action.type === "positive"
                      ? "rgba(91,184,122,0.12)"
                      : "rgba(200,94,94,0.12)"}`,
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: action.type === "positive" ? "#5BB87A" : "#C85E5E" }}>
                      {action.type === "positive" ? "✓" : "✕"}
                    </span>
                    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "#EDE9DF" }}>
                      {action.label}
                    </span>
                  </div>
                  <button
                    onClick={() => removeAction(action._id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#4A475E",
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {allActions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: "center", padding: "40px 20px" }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 17,
              fontStyle: "italic",
              color: "#4A475E",
            }}
          >
            Your day is still unwritten. Tap an action above to begin.
          </p>
        </motion.div>
      )}
    </div>
  );
}
