"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLog,
  useSetIntention,
  useRemoveAction,
  useAnalytics,
} from "@/features/log/hooks";
import ScoreRing from "@/components/ScoreRing";
import TraitBar from "@/components/TraitBar";
import GrowthChart from "@/components/GrowthChart";
import { X, TrendingUp } from "lucide-react";

const TRAIT_ORDER = [
  "compassion",
  "honesty",
  "discipline",
  "patience",
  "gratitude",
] as const;

export default function DashboardPage() {
  const { data: log, isLoading } = useLog();
  const { data: history } = useAnalytics();
  const { mutate: setIntention, isPending: savingIntention } =
    useSetIntention();
  const { mutate: removeAction } = useRemoveAction();
  const [intentionInput, setIntentionInput] = useState("");

  const positiveActions =
    log?.actions.filter((a) => a.type === "positive") ?? [];
  const negativeActions =
    log?.actions.filter((a) => a.type === "negative") ?? [];
  const recentActions = [...(log?.actions ?? [])].reverse().slice(0, 8);

  function handleSetIntention(e: React.FormEvent) {
    e.preventDefault();
    if (intentionInput.trim()) {
      setIntention(intentionInput.trim());
      setIntentionInput("");
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          paddingTop: 16,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: i === 1 ? 280 : 120,
              background: "#12121A",
              borderRadius: 16,
              border: "1px solid #1E1E2E",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    );
  }

  const score = log?.humanityScore ?? 50;
  const ratingOutOffTen = (score / 10).toFixed(1);
  const traits = log?.traits ?? {
    compassion: 50,
    honesty: 50,
    discipline: 50,
    patience: 50,
    gratitude: 50,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Background glow */}
      <div
        className="glow-gold"
        style={{
          width: 400,
          height: 400,
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-card"
        style={{
          padding: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
        }}
      >
        <ScoreRing score={score} size={180} />

        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50px",
            transform: "translateX(-50%)",
            background: "#1E1E2E",
            padding: "4px 12px",
            borderRadius: 12,
            border: "1px solid #2A2A3C",
          }}
        >
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#C8973A",
            }}
          >
            {ratingOutOffTen}
          </span>
          <span style={{ fontSize: 11, color: "#4A475E", marginLeft: 4 }}>
            / 10
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 28,
                fontWeight: 600,
                color: "#5BB87A",
                lineHeight: 1,
              }}
            >
              {positiveActions.length}
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 11,
                color: "#4A475E",
                marginTop: 2,
                letterSpacing: "0.06em",
              }}
            >
              KIND ACTIONS
            </p>
          </div>
          <div style={{ width: 1, height: 32, background: "#1E1E2E" }} />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 28,
                fontWeight: 600,
                color: "#C85E5E",
                lineHeight: 1,
              }}
            >
              {negativeActions.length}
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 11,
                color: "#4A475E",
                marginTop: 2,
                letterSpacing: "0.06em",
              }}
            >
              TO GROW FROM
            </p>
          </div>
        </div>
      </motion.div>

      {/* Growth Analytics Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="h-card"
        style={{ padding: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <TrendingUp size={16} color="#C8973A" />
          <p className="section-label" style={{ marginBottom: 0 }}>
            Growth Analytics
          </p>
        </div>
        <GrowthChart data={history ?? []} />
      </motion.div>

      {/* Intention Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="h-card-gold"
        style={{ padding: 20 }}
      >
        <p className="section-label" style={{ marginBottom: 12 }}>
          ✦ Today&apos;s Intention
        </p>

        <AnimatePresence mode="wait">
          {log?.intention ? (
            <motion.div
              key="set"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 19,
                  fontStyle: "italic",
                  color: "#C8973A",
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                &quot;{log.intention}&quot;
              </p>
              <button
                onClick={() => setIntention("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4A475E",
                  cursor: "pointer",
                  padding: 4,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSetIntention}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="h-input"
                  value={intentionInput}
                  onChange={(e) => setIntentionInput(e.target.value)}
                  placeholder="What do you want to embody today?"
                  style={{ flex: 1, fontSize: 14 }}
                />
                <button
                  type="submit"
                  disabled={savingIntention || !intentionInput.trim()}
                  style={{
                    padding: "0 16px",
                    background: "rgba(200,151,58,0.15)",
                    border: "1px solid rgba(200,151,58,0.3)",
                    borderRadius: 10,
                    color: "#C8973A",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    opacity: savingIntention ? 0.5 : 1,
                  }}
                >
                  Set
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {[
                  "Patience",
                  "Kindness",
                  "Honesty",
                  "Discipline",
                  "Presence",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setIntention(chip)}
                    style={{
                      padding: "4px 12px",
                      background: "rgba(200,151,58,0.08)",
                      border: "1px solid rgba(200,151,58,0.15)",
                      borderRadius: 999,
                      color: "#7A7690",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Recent Actions */}
      <AnimatePresence>
        {recentActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="h-card"
            style={{ padding: 20 }}
          >
            <p className="section-label" style={{ marginBottom: 14 }}>
              Today&apos;s Actions
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {recentActions.map((action) => (
                <motion.div
                  key={action._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span
                    className={
                      action.type === "positive"
                        ? "chip-positive"
                        : "chip-negative"
                    }
                    style={{ cursor: "default" }}
                  >
                    {action.label}
                    <button
                      onClick={() => removeAction(action._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.6,
                      }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trait Bars */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-card"
        style={{ padding: 20 }}
      >
        <p className="section-label" style={{ marginBottom: 16 }}>
          Character Traits
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {TRAIT_ORDER.map((trait, i) => (
            <div key={trait}>
              <TraitBar name={trait} score={traits[trait]} delay={i * 80} />
              {i < TRAIT_ORDER.length - 1 && (
                <div
                  style={{ height: 1, background: "#1E1E2E", marginTop: 16 }}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
