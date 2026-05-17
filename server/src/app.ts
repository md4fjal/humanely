import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import logRoutes from "./routes/log.routes.js";
import reflectionRoutes from "./routes/reflection.routes.js";
import { connectDB } from "./config/db.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/log", logRoutes);
app.use("/api/reflection", reflectionRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Humanely server running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
