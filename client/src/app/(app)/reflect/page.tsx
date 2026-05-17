"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLog, useGenerateReflection } from "@/features/log/hooks";
import { Sparkles } from "lucide-react";

export default function ReflectPage() {
  const { data: log } = useLog();
  const { mutate: generate, isPending, data: reflectionData, reset } = useGenerateReflection();

  const positiveCount = log?.actions.filter((a) => a.type === "positive").length ?? 0;
  const negativeCount = log?.actions.filter((a) => a.type === "negative").length ?? 0;
  const score = log?.humanityScore ?? 50;
  const hasActions = (log?.actions.length ?? 0) > 0;

  function getScoreColor(s: number) {
    if (s >= 75) return "#5BB87A";
    if (s >= 50) return "#C8973A";
    return "#C85E5E";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Ambient glow */}
      <div
        className="glow-gold"
        style={{ width: 500, height: 500, top: -150, left: "50%", transform: "translateX(-50%)" }}
      />

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
      >
        <div
          className="h-card-green"
          style={{ padding: "16px 12px", textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 32,
              fontWeight: 600,
              color: "#5BB87A",
              lineHeight: 1,
            }}
          >
            {positiveCount}
          </p>
          <p className="section-label" style={{ marginTop: 6, color: "#5BB87A" }}>
            Growth
          </p>
        </div>
        <div
          className="h-card-red"
          style={{ padding: "16px 12px", textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 32,
              fontWeight: 600,
              color: "#C85E5E",
              lineHeight: 1,
            }}
          >
            {negativeCount}
          </p>
          <p className="section-label" style={{ marginTop: 6, color: "#C85E5E" }}>
            Learning
          </p>
        </div>
        <div
          className="h-card-gold"
          style={{ padding: "16px 12px", textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 32,
              fontWeight: 600,
              color: getScoreColor(score),
              lineHeight: 1,
            }}
          >
            {score}
          </p>
          <p className="section-label" style={{ marginTop: 6, color: "#C8973A" }}>
            Score
          </p>
        </div>
      </motion.div>

      {/* Intention recap */}
      {log?.intention && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-card-gold"
          style={{ padding: 20 }}
        >
          <p className="section-label" style={{ marginBottom: 10 }}>Your Intention</p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 19,
              fontStyle: "italic",
              color: "#C8973A",
              lineHeight: 1.6,
            }}
          >
            "{log.intention}"
          </p>
        </motion.div>
      )}

      {/* AI Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {!hasActions ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 18,
                fontStyle: "italic",
                color: "#4A475E",
                lineHeight: 1.7,
              }}
            >
              Log some actions first, then return here for your evening reflection.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence mode="wait">
              {!reflectionData ? (
                <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isPending ? (
                    <div
                      className="h-card"
                      style={{
                        padding: 32,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      {/* Meditative pulsing orb */}
                      <div style={{ position: "relative", width: 80, height: 80 }}>
                        <div
                          className="pulse-glow"
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(200,151,58,0.3), transparent)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 8,
                            borderRadius: "50%",
                            background: "rgba(200,151,58,0.08)",
                            border: "1px solid rgba(200,151,58,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ color: "#C8973A", fontSize: 22 }}>✦</span>
                        </div>
                      </div>
                      <p
                        className="pulse-glow"
                        style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: 18,
                          fontStyle: "italic",
                          color: "#7A7690",
                        }}
                      >
                        Sitting with your day...
                      </p>
                    </div>
                  ) : (
                    <button
                      id="get-reflection-btn"
                      className="btn-gold"
                      onClick={() => generate()}
                    >
                      <Sparkles size={16} />
                      Get AI Reflection
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="reflection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="reflection-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <span style={{ color: "#C8973A" }}>✦</span>
                      <p className="section-label" style={{ color: "#C8973A" }}>
                        Your Reflection
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: 19,
                        fontStyle: "italic",
                        color: "#EDE9DF",
                        lineHeight: 1.75,
                      }}
                    >
                      {reflectionData.reflection}
                    </p>
                  </div>

                  <button
                    onClick={() => reset()}
                    className="btn-ghost"
                    style={{ marginTop: 12, width: "100%" }}
                  >
                    Reflect again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Closing space */}
      <div style={{ height: 20 }} />
    </div>
  );
}
