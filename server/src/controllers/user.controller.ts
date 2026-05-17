import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { DailyLog } from "../models/dailyLog.model.js";
import bcrypt from "bcrypt";

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

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({ message: "This account uses Google login. You don't have a password set." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password!);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isOnboarded: true } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Onboarding completed", user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to complete onboarding" });
  }
};
