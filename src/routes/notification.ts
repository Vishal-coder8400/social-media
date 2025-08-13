import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";
import { verifyFirebaseToken, requireUser } from "../middlewares/authMiddleware";
import { checkBlockedUser } from "../middlewares/checkBlockedUser";
import { checkFeatureAccess } from "../middlewares/checkFeatureRestriction";

const router = express.Router();

// ✅ Get all notifications
router.get(
  "/getAllNotifications",
  verifyFirebaseToken,
  checkBlockedUser,
  checkFeatureAccess("notification"),
  getNotifications
);

// ✅ Mark a specific notification as read
router.patch(
  "/notifications/:id/read",
  verifyFirebaseToken,
  checkBlockedUser,
  checkFeatureAccess("notification"),
  markAsRead
);

// ✅ Mark all notifications as read
router.patch(
  "/notifications/mark-all-read",
  verifyFirebaseToken,
  checkBlockedUser,
  checkFeatureAccess("notification"),
  markAllAsRead
);

export default router;
