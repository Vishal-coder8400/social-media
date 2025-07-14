import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController";
import { verifyFirebaseToken, requireUser } from "../middlewares/authMiddleware";
import { checkBlockedUser } from "../middlewares/checkBlockedUser";
import { checkFeatureAccess } from "../middlewares/checkFeatureRestriction";

const router = express.Router();

router.get("/getNotiication",
     verifyFirebaseToken,
     checkBlockedUser,
     checkFeatureAccess("notification"),
      getNotifications
    );
router.patch("/:id/read", 
    verifyFirebaseToken,
    checkBlockedUser,
     checkFeatureAccess("notification"),
     markAsRead
    );

export default router;
