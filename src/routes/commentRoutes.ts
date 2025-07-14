import express from "express";
import {
  addComment,
  replyToComment,
  deleteComment,
  getCommentsByPost,
  toggleLikeComment,
} from "../controllers/commentController";
import { verifyFirebaseToken } from "../middlewares/authMiddleware";
import { checkBlockedUser } from "../middlewares/checkBlockedUser";
import { checkFeatureAccess } from "../middlewares/checkFeatureRestriction";

const router = express.Router();

router.post("/addComment",
   verifyFirebaseToken,
   checkBlockedUser, 
   checkFeatureAccess("comment"),
   addComment
  );
router.post("/replyCommnet/:commentId/reply",
  verifyFirebaseToken,
  checkBlockedUser,
  checkFeatureAccess("comment"),
   replyToComment
  );
router.delete("/delete/:commentId",verifyFirebaseToken,checkBlockedUser, deleteComment);
router.get("/getpostComment/:postId",verifyFirebaseToken,checkBlockedUser, getCommentsByPost);
router.post("/:commentId/like",
   verifyFirebaseToken,
   checkBlockedUser, 
    checkFeatureAccess("like"),
   toggleLikeComment
  );


export default router;
