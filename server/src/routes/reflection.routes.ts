import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateReflection, generateWeeklySummary } from "../controllers/reflection.controller.js";

const router = Router();

router.use(protect);
router.post("/generate", generateReflection);
router.post("/weekly", generateWeeklySummary);

export default router;
