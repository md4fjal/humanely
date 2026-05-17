import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  signup,
  login,
  googleLogin,
  refresh,
  logout,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { signupSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "../utils/validators.js";

const router = Router();

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs for auth routes
  message: "Too many authentication attempts, please try again after 15 minutes",
});

router.use(authLimiter);

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOtp);
router.post("/login", validateRequest(loginSchema), login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.post("/google", googleLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
