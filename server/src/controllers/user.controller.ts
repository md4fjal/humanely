import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { DailyLog } from "../models/dailyLog.model.js";

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(400).json({ message: "No user found." });
  }

  return res.status(200).json({
    message: "user profile fetched succesfully.",
    user,
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { name } },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile updated", user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

export const resetData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    await DailyLog.deleteMany({ userId });
    
    return res.status(200).json({ message: "All logs deleted successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Failed to reset data" });
  }
};
