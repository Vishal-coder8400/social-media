import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  toggleSavePost,
  getSavedPosts,
  toggleLikePost,
  sharePost,
  trackPostView,
  getPostAnalytics,
  getPostsByCategory,
  votePollOption,
  getPostVotePollById,
} from "../controllers/postController";

import {
  verifyFirebaseToken,
  requireAdmin,
  requireUser,
} from "../middlewares/authMiddleware";

import { upload } from "../middlewares/multer";
import { checkBlockedUser } from "../middlewares/checkBlockedUser";
import { checkFeatureAccess } from "../middlewares/checkFeatureRestriction";

const router = express.Router();


// -------------------- Admin Post Management --------------------

// Create Post (Admin)
router.post(
  "/createPost",
  verifyFirebaseToken,
  requireAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
     { name: "videoThumbnail", maxCount: 1 },
  ]),
  createPost
);

// Update Post (Admin)
router.put(
  "/updatePost/:id",
  verifyFirebaseToken,
  requireAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
     { name: "videoThumbnail", maxCount: 1 },
  ]),
  updatePost
);

// Delete Post (Admin)
router.delete(
  "/deletePost/:id",
  verifyFirebaseToken,
  requireAdmin,
  deletePost
);

// Post Analytics (Admin)
router.get(
  "/analytics/:postId",
  verifyFirebaseToken,
  requireAdmin,
  getPostAnalytics
);


// -------------------- Public / User Routes --------------------

// Get All Posts
router.get("/getAllPost",
  verifyFirebaseToken,
  checkBlockedUser,
   getAllPosts
  );

// Get Post by ID
router.get("/getPostById/:id",verifyFirebaseToken,checkBlockedUser, getPostById);

// Get Posts by Category
router.get("/category/:category", verifyFirebaseToken,checkBlockedUser, getPostsByCategory);

// Like / Unlike Post
router.post("/:postId/like",
   verifyFirebaseToken,
   checkBlockedUser,
     checkFeatureAccess("like"),
   toggleLikePost);

// Save / Unsave Post
router.post("/:postId/save",
   verifyFirebaseToken,
   checkBlockedUser,
    checkFeatureAccess("save"),
    toggleSavePost
  );

// Get All Saved Posts
router.get("/saved", verifyFirebaseToken,checkBlockedUser, getSavedPosts);

// Share Post
router.post("/:postId/share", 
  verifyFirebaseToken,
  checkBlockedUser,
   checkFeatureAccess("share"),
  sharePost
);

// Track View
router.get("/trackView/:postId", verifyFirebaseToken,checkBlockedUser, trackPostView);


// -------------------- Poll Voting --------------------

// Vote on a Poll Option (User/Admin)
router.post("/vote",
   verifyFirebaseToken,
   checkBlockedUser, 
     checkFeatureAccess("post"),
   votePollOption);

// Get Poll Vote Result by Post ID (Only shows results if user voted)
router.get("/voteResult/:id", verifyFirebaseToken,checkBlockedUser, getPostVotePollById);


export default router;
