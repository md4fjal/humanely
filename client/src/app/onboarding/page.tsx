"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSetIntention } from "@/features/log/hooks";

const SLIDES = [
  {
    icon: "◎",
    title: "The Mirror",
    body: "This is not an app that judges you. It is a space where you can be honest with yourself. Every action you log is a conversation between you and who you want to become.",
  },
  {
    icon: "✦",
    title: "The Score",
    body: "Your Humanity Score is not your worth. It is a reflection of your recent choices — a compass, not a verdict. It changes every day because you do.",
  },
  {
    icon: "〜",
    title: "The Reflection",
    body: "Each evening, your AI companion will sit with you and help you understand your day — without shame, without judgment. Just awareness.",
  },
];

const INTENTION_CHIPS = ["Patience", "Kindness", "Honesty", "Discipline", "Presence"];

export default function OnboardingPage() {
  const router = useRouter();
  const { mutate: setIntention, isPending } = useSetIntention();
  const [step, setStep] = useState<"welcome" | "slides" | "intention">("welcome");
  const [slideIndex, setSlideIndex] = useState(0);
  const [intentionInput, setIntentionInput] = useState("");

  function handleSlideNext() {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setStep("intention");
    }
  }

  function handleSlidePrev() {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  }

  function handleSetIntention(val?: string) {
    const intention = val || intentionInput.trim();
    if (intention) {
      setIntention(intention, {
        onSuccess: () => {
          localStorage.setItem("humanely_onboarded", "true");
          router.push("/");
        },
      });
    } else {
      // Skip
      localStorage.setItem("humanely_onboarded", "true");
      router.push("/");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0B10",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,151,58,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "30%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,184,122,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {/* WELCOME */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 32 }}
            >
              {/* App name */}
              <div>
                <h1
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 52,
                    fontWeight: 600,
                    color: "#EDE9DF",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  Humanely
                </h1>
                <div style={{ width: 48, height: 1, background: "rgba(200,151,58,0.4)", margin: "20px auto" }} />
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 22,
                    fontStyle: "italic",
                    color: "#C8973A",
                    lineHeight: 1.5,
                  }}
                >
                  How humanely are you living?
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 14,
                    color: "#4A475E",
                    marginTop: 12,
                    letterSpacing: "0.02em",
                  }}
                >
                  A private mirror for your daily choices.
                </p>
              </div>

              <button
                className="btn-gold"
                onClick={() => setStep("slides")}
                style={{ maxWidth: 240 }}
              >
                Begin
              </button>
            </motion.div>
          )}

          {/* SLIDES */}
          {step === "slides" && (
            <motion.div
              key={`slide-${slideIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              style={{ display: "flex", flexDirection: "column", gap: 40 }}
            >
              {/* Slide content */}
              <div
                className="h-card"
                style={{ padding: "40px 32px", textAlign: "center" }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(200,151,58,0.08)",
                    border: "1px solid rgba(200,151,58,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    color: "#C8973A",
                    margin: "0 auto 24px",
                  }}
                >
                  {SLIDES[slideIndex].icon}
                </div>
                <h2
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#EDE9DF",
                    marginBottom: 16,
                  }}
                >
                  {SLIDES[slideIndex].title}
                </h2>
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "#7A7690",
                    lineHeight: 1.75,
                  }}
                >
                  {SLIDES[slideIndex].body}
                </p>
              </div>

              {/* Dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                {SLIDES.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    style={{
                      width: i === slideIndex ? 24 : 6,
                      height: 6,
                      borderRadius: 999,
                      background: i === slideIndex ? "#C8973A" : "#1E1E2E",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>

              {/* Nav */}
              <div style={{ display: "flex", gap: 12 }}>
                {slideIndex > 0 && (
                  <button
                    className="btn-ghost"
                    onClick={handleSlidePrev}
                    style={{ flex: 1 }}
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                )}
                <button
                  className="btn-gold"
                  onClick={handleSlideNext}
                  style={{ flex: 2 }}
                >
                  {slideIndex < SLIDES.length - 1 ? "Continue" : "Set my intention"}
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* INTENTION */}
          {step === "intention" && (
            <motion.div
              key="intention"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >
              <div style={{ textAlign: "center" }}>
                <h2
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#EDE9DF",
                    marginBottom: 8,
                  }}
                >
                  Set Your First Intention
                </h2>
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 17,
                    fontStyle: "italic",
                    color: "#4A475E",
                  }}
                >
                  What quality do you want to live by today?
                </p>
              </div>

              <div className="h-card-gold" style={{ padding: 20 }}>
                <input
                  className="h-input"
                  value={intentionInput}
                  onChange={(e) => setIntentionInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSetIntention(); }}
                  placeholder="e.g. I want to stay patient today..."
                  style={{ marginBottom: 14 }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {INTENTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setIntentionInput(chip)}
                      style={{
                        padding: "5px 14px",
                        background: intentionInput === chip
                          ? "rgba(200,151,58,0.2)"
                          : "rgba(200,151,58,0.06)",
                        border: `1px solid ${intentionInput === chip ? "rgba(200,151,58,0.5)" : "rgba(200,151,58,0.15)"}`,
                        borderRadius: 999,
                        color: intentionInput === chip ? "#C8973A" : "#7A7690",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.18s",
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  className="btn-gold"
                  disabled={isPending || !intentionInput.trim()}
                  onClick={() => handleSetIntention()}
                >
                  {isPending ? "Setting..." : "Set My Intention ✦"}
                </button>
                <button
                  onClick={() => handleSetIntention("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4A475E",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "8px 0",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                  }}
                >
                  I'll set one later
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
