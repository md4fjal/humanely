import mongoose, { Document, Schema } from "mongoose";

export interface IAction {
  _id?: string;
  label: string;
  type: "positive" | "negative";
  trait?: string;
  delta: number;
  loggedAt: Date;
}

export interface IDailyLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // "YYYY-MM-DD"
  intention: string;
  actions: IAction[];
  humanityScore: number;
  traits: {
    compassion: number;
    honesty: number;
    discipline: number;
    patience: number;
    gratitude: number;
  };
}

const actionSchema = new Schema<IAction>({
  label: { type: String, required: true },
  type: { type: String, enum: ["positive", "negative"], required: true },
  trait: { type: String },
  delta: { type: Number, required: true },
  loggedAt: { type: Date, default: Date.now },
});

const dailyLogSchema = new Schema<IDailyLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    intention: { type: String, default: "" },
    actions: [actionSchema],
    humanityScore: { type: Number, default: 50 },
    traits: {
      compassion: { type: Number, default: 50 },
      honesty: { type: Number, default: 50 },
      discipline: { type: Number, default: 50 },
      patience: { type: Number, default: 50 },
      gratitude: { type: Number, default: 50 },
    },
  },
  { timestamps: true },
);

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyLog = mongoose.model<IDailyLog>("DailyLog", dailyLogSchema);
