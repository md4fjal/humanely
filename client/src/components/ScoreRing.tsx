"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
}

function getScoreColor(score: number) {
  if (score >= 75) return "#5BB87A";
  if (score >= 50) return "#C8973A";
  return "#C85E5E";
}

function getScoreLabel(score: number) {
  if (score >= 75) return "Living with great intention.";
  if (score >= 50) return "Growing through awareness.";
  return "Every choice is a new start.";
}

export default function ScoreRing({ score, size = 200 }: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // Animate score count-up
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1200;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const progressOffset =
    circumference - (displayed / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E1E2E"
            strokeWidth={10}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.5s ease" }}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: size * 0.28,
              fontWeight: 600,
              color: color,
              lineHeight: 1,
            }}
          >
            {displayed}
          </span>
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4A475E",
              marginTop: 4,
            }}
          >
            Humanity
          </span>
        </div>
      </div>
      <p
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: 17,
          fontStyle: "italic",
          color: "#7A7690",
          textAlign: "center",
        }}
      >
        {label}
      </p>
    </div>
  );
}
