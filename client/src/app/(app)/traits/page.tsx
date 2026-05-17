"use client";

import { motion } from "framer-motion";
import { useLog } from "@/features/log/hooks";
import TraitBar from "@/components/TraitBar";

const TRAIT_ORDER = [
  { key: "compassion", icon: "♡", description: "Empathy and care for others" },
  { key: "honesty", icon: "◎", description: "Integrity and truthfulness" },
  { key: "discipline", icon: "◈", description: "Consistency and self-control" },
  { key: "patience", icon: "〜", description: "Calm under pressure" },
  { key: "gratitude", icon: "✦", description: "Appreciation and awareness" },
] as const;

function getScoreColor(score: number) {
  if (score >= 75) return "#5BB87A";
  if (score >= 50) return "#C8973A";
  return "#C85E5E";
}

export default function TraitsPage() {
  const { data: log } = useLog();

  const traits = log?.traits ?? {
    compassion: 50,
    honesty: 50,
    discipline: 50,
    patience: 50,
    gratitude: 50,
  };

  const traitEntries = TRAIT_ORDER.map((t) => ({
    ...t,
    score: traits[t.key],
  }));

  const strongest = [...traitEntries].sort((a, b) => b.score - a.score)[0];
  const weakest = [...traitEntries].sort((a, b) => a.score - b.score)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 26,
            fontWeight: 600,
            color: "#EDE9DF",
            marginBottom: 4,
          }}
        >
          Character Traits
        </h2>
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 16,
            fontStyle: "italic",
            color: "#4A475E",
          }}
        >
          What kind of person are you becoming?
        </p>
      </motion.div>

      {/* Trait Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="h-card"
        style={{ padding: 24 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {traitEntries.map((trait, i) => (
            <div key={trait.key}>
              {/* Extended trait row with description */}
              <div style={{ marginBottom: 8 }}>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 11,
                    color: "#4A475E",
                    letterSpacing: "0.04em",
                  }}
                >
                  {trait.description}
                </p>
              </div>
              <TraitBar name={trait.key} score={trait.score} delay={i * 80} />
              {i < traitEntries.length - 1 && (
                <div style={{ height: 1, background: "#1E1E2E", marginTop: 20 }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Strongest & Needs Attention */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Strongest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-card"
          style={{ padding: 20 }}
        >
          <p className="section-label" style={{ marginBottom: 14, color: "#5BB87A" }}>
            Strongest
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(91,184,122,0.1)",
                border: "1px solid rgba(91,184,122,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "#5BB87A",
              }}
            >
              {strongest?.icon}
            </div>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 17,
                color: "#5BB87A",
                fontWeight: 600,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {strongest?.key}
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 12,
                color: "#4A475E",
              }}
            >
              {strongest?.score} / 100
            </p>
          </div>
        </motion.div>

        {/* Needs Attention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="h-card"
          style={{ padding: 20 }}
        >
          <p className="section-label" style={{ marginBottom: 14, color: "#C8973A" }}>
            Room to Grow
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(200,151,58,0.08)",
                border: "1px solid rgba(200,151,58,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "#C8973A",
              }}
            >
              {weakest?.icon}
            </div>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 17,
                color: "#C8973A",
                fontWeight: 600,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {weakest?.key}
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 12,
                color: "#4A475E",
              }}
            >
              {weakest?.score} / 100
            </p>
          </div>
        </motion.div>
      </div>

      {/* Philosophy note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{ textAlign: "center", padding: "8px 0 16px" }}
      >
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 15,
            fontStyle: "italic",
            color: "#2A2A3E",
            lineHeight: 1.7,
          }}
        >
          These scores reflect your recent choices — a compass, not a verdict.
        </p>
      </motion.div>
    </div>
  );
}
