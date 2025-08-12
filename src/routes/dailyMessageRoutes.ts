import express from "express";
import {
  createDailyMessage,
  
  getDailyMessage,
  updateDailyMessage,
  deleteDailyMessage,
  getDailyMessageById,
} from "../controllers/dailyMessageController";

import {
  verifyFirebaseToken,
  requireAdmin,
} from "../middlewares/authMiddleware";
import { checkBlockedUser } from "../middlewares/checkBlockedUser";
import { checkFeatureAccess } from "../middlewares/checkFeatureRestriction";

const router = express.Router();

router.post("/postDailyMsg", verifyFirebaseToken, requireAdmin, createDailyMessage);
router.get("/getAllDailyMsg",verifyFirebaseToken,
  checkBlockedUser,
    checkFeatureAccess("post"),
   getDailyMessage
  ); // Public (users)
  
router.get("/dailyMsgById/:id",
  verifyFirebaseToken,
  checkBlockedUser,
 checkFeatureAccess("post"),
   getDailyMessageById
  );
router.put("/updateDailyMsg/:id", verifyFirebaseToken, requireAdmin, updateDailyMessage);
router.delete("/deleteDailyMsg/:id", verifyFirebaseToken, requireAdmin, deleteDailyMessage);

export default router;
