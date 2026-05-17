"use client";

import { motion } from "framer-motion";

interface HistoryItem {
  date: string;
  score: number;
  rating: string;
}

interface GrowthChartProps {
  data: HistoryItem[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#4A475E", fontSize: 14 }}>
        Not enough data yet to show growth.
      </div>
    );
  }

  const width = 400;
  const height = 140;
  const padding = 20;

  const maxScore = 100;
  const minScore = 0;

  const points = data.map((item, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - ((item.score - minScore) / (maxScore - minScore)) * (height - padding * 2);
    return { x, y, score: item.score, date: item.date };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div style={{ position: "relative", height }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8973A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C8973A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1E1E2E" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1E1E2E" strokeWidth="1" />

          {/* Area under the line */}
          <motion.path
            d={areaD}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* The line itself */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#C8973A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#12121A"
              stroke="#C8973A"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </svg>

        {/* Labels */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: `0 ${padding}px`, marginTop: -10 }}>
          {data.map((item, i) => (
            <div key={i} style={{ textAlign: "center", width: 40 }}>
              <p style={{ fontSize: 9, color: "#4A475E", fontFamily: "DM Sans, sans-serif" }}>
                {item.date.split("-").slice(1).join("/")}
              </p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#C8973A", fontFamily: "Cormorant Garamond, serif" }}>
                {(item.score / 10).toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
