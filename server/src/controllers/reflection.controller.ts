import { Request, Response } from "express";
import { DailyLog } from "../models/dailyLog.model.js";

// POST /api/reflection/generate
export const generateReflection = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const date = new Date().toISOString().split("T")[0];

    const log = await DailyLog.findOne({ userId, date });
    if (!log) {
      return res
        .status(400)
        .json({ message: "No log found for today. Log some actions first." });
    }

    const positiveActions = log.actions
      .filter((a) => a.type === "positive")
      .map((a) => a.label)
      .join(", ");

    const negativeActions = log.actions
      .filter((a) => a.type === "negative")
      .map((a) => a.label)
      .join(", ");

    const intention = log.intention || "";
    const score = log.humanityScore;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      // Fallback mock reflection if no API key
      const mockReflection = buildMockReflection(
        intention,
        positiveActions,
        negativeActions,
        score,
      );
      return res.json({ reflection: mockReflection });
    }

    const systemPrompt = `You are a compassionate, non-judgmental AI companion for a self-reflection app called Ensanit. 
Your role is to help users understand their day — not to judge, lecture, or prescribe. 
Speak directly to the user as "you". Reference specific actions they logged by name when relevant.
Acknowledge both growth and moments of difficulty with equal warmth.
Never use the words: failure, bad, wrong, mistake, poor, weak, or any shame-inducing language.
Never give prescriptive advice — only open, reflective questions.
Keep your reflection to 3-4 sentences maximum, then end with a single reflective question.
Tone: a wise, warm friend on a quiet evening.`;

    const userPrompt = `Today's data:
- Morning intention: "${intention || "No intention set today"}"
- Moments of growth: ${positiveActions || "None logged"}
- Moments to learn from: ${negativeActions || "None logged"}  
- Humanity Score today: ${score}/100

Write a personal evening reflection for this person.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Gemini API error:", err);
      const fallback = buildMockReflection(
        intention,
        positiveActions,
        negativeActions,
        score,
      );
      return res.json({ reflection: fallback });
    }

    const geminiData = await geminiRes.json();
    const reflection =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      buildMockReflection(intention, positiveActions, negativeActions, score);

    return res.json({ reflection });
  } catch (e) {
    console.error("Reflection error:", e);
    return res.status(500).json({ message: "Could not generate reflection" });
  }
};

// POST /api/reflection/weekly
export const generateWeeklySummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    // Get last 7 days of logs
    const logs = await DailyLog.find({ userId }).sort({ date: -1 }).limit(7);

    if (!logs.length) {
      return res.status(400).json({ message: "No logs found to summarize." });
    }

    const latestLog = logs[0];
    const avgScore = Math.round(
      logs.reduce((sum, log) => sum + log.humanityScore, 0) / logs.length,
    );
    const totalPos = logs.reduce(
      (sum, log) =>
        sum + log.actions.filter((a: any) => a.type === "positive").length,
      0,
    );
    const totalNeg = logs.reduce(
      (sum, log) =>
        sum + log.actions.filter((a: any) => a.type === "negative").length,
      0,
    );

    // Filter out _id and other non-trait keys if any, though mongoose traits object is typed
    const traits = latestLog.traits as any;
    const traitsEntries = [
      ["compassion", traits.compassion],
      ["honesty", traits.honesty],
      ["discipline", traits.discipline],
      ["patience", traits.patience],
      ["gratitude", traits.gratitude],
    ];

    const sortedTraits = traitsEntries.sort(
      (a, b) => (b[1] as number) - (a[1] as number),
    );
    const strongestTrait = sortedTraits[0];
    const weakestTrait = sortedTraits[sortedTraits.length - 1];

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      const mockSummary = `Over the past ${logs.length} days, your average humanity score was ${avgScore}. You leaned into ${strongestTrait[0]} with a score of ${strongestTrait[1]}, showing great growth. Keep working on ${weakestTrait[0]} (${weakestTrait[1]}) for the week ahead. How might you bring more intention into your next choices?`;
      return res.json({ summary: mockSummary });
    }

    const systemPrompt = `You are a compassionate, non-judgmental AI companion for a self-reflection app called Ensanit. 
Generate a thoughtful, personal weekly character summary.
Speak directly to the user as "you". 
Acknowledge both growth and moments of difficulty with equal warmth.
Keep your reflection to 3-4 sentences maximum, then end with a single reflective question for the week ahead.
Tone: a wise, warm friend on a quiet evening.`;

    const userPrompt = `Data from the past week:
- Average humanity score: ${avgScore}/100
- Total growth actions: ${totalPos}
- Total learning moments: ${totalNeg}
- Strongest trait: ${strongestTrait[0]} (${strongestTrait[1]})
- Needs most growth: ${weakestTrait[0]} (${weakestTrait[1]})

Write a warm, insightful weekly summary.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Gemini API error:", err);
      const mockSummary = `Over the past ${logs.length} days, your average humanity score was ${avgScore}. You leaned into ${strongestTrait[0]} with a score of ${strongestTrait[1]}, showing great growth. Keep working on ${weakestTrait[0]} (${weakestTrait[1]}) for the week ahead. How might you bring more intention into your next choices?`;
      return res.json({ summary: mockSummary });
    }

    const geminiData = await geminiRes.json();
    const summary =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      `Over the past ${logs.length} days, your average humanity score was ${avgScore}. You leaned into ${strongestTrait[0]} with a score of ${strongestTrait[1]}, showing great growth. Keep working on ${weakestTrait[0]} (${weakestTrait[1]}) for the week ahead. How might you bring more intention into your next choices?`;

    return res.json({ summary });
  } catch (e) {
    console.error("Weekly summary error:", e);
    return res
      .status(500)
      .json({ message: "Could not generate weekly summary" });
  }
};

function buildMockReflection(
  intention: string,
  positive: string,
  negative: string,
  score: number,
): string {
  const parts: string[] = [];

  if (intention) {
    parts.push(
      `You began today holding the intention of "${intention}" — and that alone is a meaningful place to start.`,
    );
  }

  if (positive) {
    parts.push(
      `The moments of growth you carried today — ${positive} — speak to a person who is genuinely trying.`,
    );
  }

  if (negative) {
    parts.push(
      `The harder moments, like ${negative}, are not evidence of who you are — they are simply part of an honest day.`,
    );
  }

  if (score >= 75) {
    parts.push(
      `Today you lived with great intention. What does it feel like to carry that into tomorrow?`,
    );
  } else if (score >= 50) {
    parts.push(
      `You are growing through awareness. What one thing would you do differently if today started over?`,
    );
  } else {
    parts.push(
      `Every choice you made today is part of your becoming. What small act of kindness can you offer yourself tonight?`,
    );
  }

  return parts.join(" ");
}
