import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getTodayLog,
  setIntention,
  addAction,
  removeAction,
  getAnalytics,
} from "../controllers/log.controller.js";

const router = Router();

router.use(protect);

router.get("/today", getTodayLog);
router.get("/analytics", getAnalytics);
router.post("/intention", setIntention);
router.post("/actions", addAction);
router.delete("/actions/:actionId", removeAction);

export default router;
