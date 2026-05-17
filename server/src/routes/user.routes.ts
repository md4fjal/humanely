import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { getProfile, updateProfile, resetData, changePassword, completeOnboarding } from "../controllers/user.controller.js";
import { changePasswordSchema } from "../utils/validators.js";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/onboard", protect, completeOnboarding);
router.delete("/reset", protect, resetData);
router.post("/change-password", protect, validateRequest(changePasswordSchema), changePassword);

export default router;
