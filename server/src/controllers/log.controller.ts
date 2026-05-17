import { Request, Response } from "express";
import { DailyLog } from "../models/dailyLog.model.js";

// Trait → actions mapping
const ACTION_TRAIT_MAP: Record<string, { trait: string; delta: number }[]> = {
  // Positive
  "Helped someone": [
    { trait: "compassion", delta: 4 },
  ],
  "Exercised": [{ trait: "discipline", delta: 4 }],
  "Meditated": [
    { trait: "discipline", delta: 3 },
    { trait: "patience", delta: 3 },
  ],
  "Apologized": [
    { trait: "honesty", delta: 4 },
    { trait: "compassion", delta: 2 },
  ],
  "Was honest": [{ trait: "honesty", delta: 5 }],
  "Showed kindness": [
    { trait: "compassion", delta: 4 },
    { trait: "patience", delta: 2 },
  ],
  "Listened well": [
    { trait: "compassion", delta: 3 },
    { trait: "patience", delta: 3 },
  ],
  "Kept a promise": [
    { trait: "honesty", delta: 4 },
    { trait: "discipline", delta: 3 },
  ],
  "Expressed gratitude": [{ trait: "gratitude", delta: 5 }],
  "Stayed calm": [{ trait: "patience", delta: 5 }],
  "Volunteered": [
    { trait: "gratitude", delta: 4 },
    { trait: "compassion", delta: 3 },
  ],
  "Checked on a friend": [
    { trait: "compassion", delta: 3 },
    { trait: "gratitude", delta: 3 },
  ],
  // Negative
  "Lost patience": [{ trait: "patience", delta: -5 }],
  "Lied": [{ trait: "honesty", delta: -6 }],
  "Was unkind": [
    { trait: "compassion", delta: -5 },
    { trait: "patience", delta: -3 },
  ],
  "Broke a promise": [
    { trait: "honesty", delta: -5 },
    { trait: "discipline", delta: -4 },
  ],
  "Procrastinated": [{ trait: "discipline", delta: -5 }],
  "Reacted in anger": [
    { trait: "patience", delta: -6 },
    { trait: "compassion", delta: -2 },
  ],
  "Was selfish": [
    { trait: "compassion", delta: -4 },
    { trait: "gratitude", delta: -4 },
  ],
  "Disrespected someone": [
    { trait: "compassion", delta: -5 },
    { trait: "honesty", delta: -3 },
  ],
  "Avoided responsibility": [
    { trait: "discipline", delta: -4 },
    { trait: "gratitude", delta: -3 },
  ],
  "Acted impulsively": [
    { trait: "discipline", delta: -4 },
    { trait: "patience", delta: -3 },
  ],
};

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function clamp(val: number) {
  return Math.min(99, Math.max(10, val));
}

function calcHumanityScore(traits: Record<string, number>) {
  const vals = Object.values(traits);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(clamp(avg));
}

// GET /api/log/today
export const getTodayLog = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const date = getTodayDate();

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = await DailyLog.create({ userId, date });
    }
    return res.json({ log });
  } catch (e) {
    return res.status(500).json({ message: "Failed to get log" });
  }
};

// POST /api/log/intention
export const setIntention = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { intention } = req.body;
    const date = getTodayDate();

    const log = await DailyLog.findOneAndUpdate(
      { userId, date },
      { $set: { intention } },
      { upsert: true, new: true },
    );
    return res.json({ log });
  } catch (e) {
    return res.status(500).json({ message: "Failed to set intention" });
  }
};

// POST /api/log/actions
export const addAction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { label, type } = req.body;
    const date = getTodayDate();

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = await DailyLog.create({ userId, date });
    }

    // Compute delta from action label
    const mappings = ACTION_TRAIT_MAP[label];
    let primaryDelta = type === "positive" ? 3 : -3;
    if (mappings && mappings.length > 0) {
      primaryDelta = mappings[0].delta;
    }

    const action = {
      label,
      type,
      delta: primaryDelta,
      loggedAt: new Date(),
    };

    log.actions.push(action as any);

    // Apply trait deltas
    if (mappings) {
      for (const m of mappings) {
        const t = m.trait as keyof typeof log.traits;
        if (log.traits[t] !== undefined) {
          log.traits[t] = clamp(log.traits[t] + m.delta);
        }
      }
    } else {
      // custom action fallback
      if (type === "positive") {
        log.traits.compassion = clamp(log.traits.compassion + 2);
      } else {
        log.traits.patience = clamp(log.traits.patience - 2);
      }
    }

    log.humanityScore = calcHumanityScore(log.traits as any);
    await log.save();
    return res.json({ log });
  } catch (e) {
    return res.status(500).json({ message: "Failed to add action" });
  }
};

// DELETE /api/log/actions/:actionId
export const removeAction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { actionId } = req.params;
    const date = getTodayDate();

    const log = await DailyLog.findOne({ userId, date });
    if (!log) return res.status(404).json({ message: "Log not found" });

    const actionIdx = log.actions.findIndex(
      (a: any) => a._id.toString() === actionId,
    );
    if (actionIdx === -1)
      return res.status(404).json({ message: "Action not found" });

    const removed = log.actions[actionIdx];
    log.actions.splice(actionIdx, 1);

    // Reverse the trait delta
    const mappings = ACTION_TRAIT_MAP[removed.label];
    if (mappings) {
      for (const m of mappings) {
        const t = m.trait as keyof typeof log.traits;
        if (log.traits[t] !== undefined) {
          log.traits[t] = clamp(log.traits[t] - m.delta);
        }
      }
    } else {
      if (removed.type === "positive") {
        log.traits.compassion = clamp(log.traits.compassion - 2);
      } else {
        log.traits.patience = clamp(log.traits.patience + 2);
      }
    }

    log.humanityScore = calcHumanityScore(log.traits as any);
    await log.save();
    return res.json({ log });
  } catch (e) {
    return res.status(500).json({ message: "Failed to remove action" });
  }
};
// GET /api/log/analytics
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    // Get last 7 days of logs
    const logs = await DailyLog.find({
      userId,
    })
      .sort({ date: -1 })
      .limit(7);

    // Format for chart: { date, score, rating }
    const history = logs.map((l) => ({
      date: l.date,
      score: l.humanityScore,
      rating: (l.humanityScore / 10).toFixed(1),
    })).reverse();

    return res.json({ history });
  } catch (e) {
    return res.status(500).json({ message: "Failed to get analytics" });
  }
};
