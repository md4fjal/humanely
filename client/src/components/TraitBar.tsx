"use client";

import { useEffect, useState } from "react";

const TRAIT_ICONS: Record<string, string> = {
  compassion: "♡",
  honesty: "◎",
  discipline: "◈",
  patience: "〜",
  gratitude: "✦",
};

interface TraitBarProps {
  name: string;
  score: number;
  delay?: number;
}

function getBarColor(score: number) {
  if (score >= 75) return "#5BB87A";
  if (score >= 50) return "#C8973A";
  return "#C85E5E";
}

export default function TraitBar({ name, score, delay = 0 }: TraitBarProps) {
  const [width, setWidth] = useState(0);
  const color = getBarColor(score);
  const icon = TRAIT_ICONS[name] || "•";
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 100);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Icon + label */}
      <div style={{ width: 110, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ color: color, fontSize: 16, width: 20, textAlign: "center" }}>
          {icon}
        </span>
        <span
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: "#EDE9DF",
          }}
        >
          {displayName}
        </span>
      </div>

      {/* Bar */}
      <div style={{ flex: 1 }}>
        <div className="trait-bar-track">
          <div
            className="trait-bar-fill"
            style={{
              width: `${width}%`,
              background: color,
              transitionDelay: `${delay}ms`,
            }}
          />
        </div>
      </div>

      {/* Score */}
      <span
        style={{
          width: 32,
          textAlign: "right",
          fontFamily: "DM Sans, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: color,
          flexShrink: 0,
        }}
      >
        {score}
      </span>
    </div>
  );
}
