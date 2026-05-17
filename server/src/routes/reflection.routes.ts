import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateReflection } from "../controllers/reflection.controller.js";

const router = Router();

router.use(protect);
router.post("/generate", generateReflection);

export default router;
