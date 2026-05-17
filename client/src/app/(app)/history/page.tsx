"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/features/log/hooks";
import GrowthChart from "@/components/GrowthChart";

export default function HistoryPage() {
  const router = useRouter();
  const { data: history, isLoading } = useAnalytics();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="pulse-glow" style={{ padding: 20 }}>
        Loading timeline...
      </div>
    );
  }

  const recent = history || [];

  function fmtDate(dStr: string) {
    return new Date(dStr).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
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
          Your Timeline
        </h2>
      </div>

      {!recent.length ? (
        <div className="h-card" style={{ padding: 32, textAlign: "center" }}>
          <p className="font-serif" style={{ fontSize: 16, fontStyle: "italic", color: "#7A7690", lineHeight: 1.6 }}>
            Your history will appear here after your first full day. Keep logging!
          </p>
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-card" style={{ padding: 20, marginBottom: 16 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Humanity Score — Last 7 Days</p>
            <GrowthChart data={recent} />
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...recent].reverse().map((d, i) => {
              const col = d.score >= 75 ? "#5BB87A" : d.score >= 55 ? "#C8973A" : "#C85E5E";
              const isSelected = selectedDate === d.date;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={d.date}
                >
                  <div
                    onClick={() => setSelectedDate(isSelected ? null : d.date)}
                    className="h-card"
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      border: isSelected ? `1px solid ${col}66` : "1px solid #1E1E2E",
                      transition: "border 0.2s",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#7A7690", marginBottom: 4 }}>
                        {fmtDate(d.date)}
                      </div>
                      {d.intention ? (
                        <div className="font-serif" style={{ fontSize: 16, fontStyle: "italic", color: "#C8973A" }}>
                          &ldquo;{d.intention}&rdquo;
                        </div>
                      ) : (
                        <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#4A475E" }}>
                          {d.pos} growth · {d.neg} learning
                        </div>
                      )}
                    </div>
                    <div className="font-serif" style={{ fontSize: 26, fontWeight: 600, color: col }}>
                      {d.score}
                    </div>
                  </div>

                  {/* Expanded view */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ marginTop: 8, display: "flex", gap: 8, overflow: "hidden" }}
                    >
                      <div className="h-card-green" style={{ flex: 1, padding: "12px 0", textAlign: "center" }}>
                        <div className="font-serif" style={{ fontSize: 22, color: "#5BB87A" }}>{d.pos}</div>
                        <div style={{ fontSize: 10, color: "#5BB87A", letterSpacing: 1.2, marginTop: 4 }}>GROWTH</div>
                      </div>
                      <div className="h-card-red" style={{ flex: 1, padding: "12px 0", textAlign: "center" }}>
                        <div className="font-serif" style={{ fontSize: 22, color: "#C85E5E" }}>{d.neg}</div>
                        <div style={{ fontSize: 10, color: "#C85E5E", letterSpacing: 1.2, marginTop: 4 }}>LEARN</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
