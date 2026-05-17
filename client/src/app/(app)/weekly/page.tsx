"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnalytics, useGenerateWeekly } from "@/features/log/hooks";

export default function WeeklyPage() {
  const router = useRouter();
  const { data: history, isLoading } = useAnalytics();
  const { mutate: generate, data: weeklyData, isPending } = useGenerateWeekly();

  if (isLoading) {
    return (
      <div className="pulse-glow" style={{ padding: 20 }}>
        Loading your week...
      </div>
    );
  }

  const week = history || [];
  const avgScore = week.length
    ? Math.round(week.reduce((a, b) => a + b.score, 0) / week.length)
    : 0;
  const totalPos = week.reduce((a, b) => a + (b.pos || 0), 0);
  const totalNeg = week.reduce((a, b) => a + (b.neg || 0), 0);

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
          Weekly Summary
        </h2>
      </div>

      {!week.length ? (
        <div className="h-card" style={{ padding: 32, textAlign: "center" }}>
          <p className="font-serif" style={{ fontSize: 16, fontStyle: "italic", color: "#7A7690", lineHeight: 1.6 }}>
            Log your actions for a few days first, then come back here for your weekly character summary.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { v: avgScore, l: "AVG SCORE", c: "#C8973A", bg: "rgba(200,151,58,0.08)" },
              { v: totalPos, l: "GROWTH ACTIONS", c: "#5BB87A", bg: "rgba(91,184,122,0.08)" },
              { v: totalNeg, l: "LEARNING MOMENTS", c: "#C85E5E", bg: "rgba(200,94,94,0.08)" },
              { v: week.length, l: "DAYS TRACKED", c: "#4ABFB8", bg: "rgba(74,191,184,0.08)" },
            ].map((m) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={m.l}
                style={{
                  background: m.bg,
                  border: `1px solid ${m.c}22`,
                  borderRadius: 12,
                  padding: "16px 14px",
                  textAlign: "center",
                }}
              >
                <span className="font-serif" style={{ fontSize: 28, fontWeight: 600, color: m.c, display: "block" }}>
                  {m.v}
                </span>
                <span style={{ fontSize: 9, color: m.c, fontFamily: "DM Sans, sans-serif", letterSpacing: 1.2, opacity: 0.8, marginTop: 4, display: "block" }}>
                  {m.l}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="h-card" style={{ padding: 20, marginBottom: 16 }}>
            <button
              onClick={() => generate()}
              disabled={isPending}
              className="btn-gold"
            >
              {isPending ? "Reviewing your week..." : "Generate Weekly Summary ✦"}
            </button>
          </div>

          {isPending && (
            <div className="h-card pulse-glow" style={{ padding: 32, textAlign: "center" }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: "2px solid #1E1E2E",
                  borderTopColor: "#C8973A",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p className="font-serif" style={{ fontSize: 16, fontStyle: "italic", color: "#7A7690" }}>
                Reviewing your week...
              </p>
            </div>
          )}

          {weeklyData?.summary && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-card-gold"
              style={{ padding: 24, background: "rgba(200,151,58,0.06)", position: "relative", overflow: "hidden" }}
            >
              <div className="glow-gold" style={{ width: 200, height: 200, top: -50, right: -50, opacity: 0.5 }} />
              
              <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", position: "relative" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(200,151,58,0.1)",
                    border: "1px solid rgba(200,151,58,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#C8973A",
                  }}
                >
                  ✦
                </div>
                <span style={{ fontSize: 11, color: "#7A7690", fontFamily: "DM Sans, sans-serif", letterSpacing: 0.5, textTransform: "uppercase" }}>
                  Your week in character
                </span>
              </div>
              <p className="font-serif" style={{ fontSize: 18, lineHeight: 1.8, color: "#EDE9DF", fontStyle: "italic", position: "relative" }}>
                {weeklyData.summary}
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
