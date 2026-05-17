import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProfile, updateProfile, resetData } from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/reset", protect, resetData);

export default router;
