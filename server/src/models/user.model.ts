import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password?: string;
  dateOfBirth?: Date;
  authProvider?: string;
  googleId?: string;
  refreshToken?: string;
  isVerified: boolean;
  verificationOtp?: string;
  verificationOtpExpiresAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    dateOfBirth: { type: Date },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, unique: true, sparse: true },
    refreshToken: { type: String, select: false },
    isVerified: { type: Boolean, default: false },
    verificationOtp: { type: String },
    verificationOtpExpiresAt: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
