import { Request, Response } from "express";
import { User } from "../models/user.model.js";

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
