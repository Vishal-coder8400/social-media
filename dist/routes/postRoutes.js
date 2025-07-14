"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
// Admin Routes
router.post("/createPost", 
//   requireAdmin,
authMiddleware_1.verifyFirebaseToken, multer_1.default.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
]), postController_1.createPost);
router.delete("/deletePost/:id", authMiddleware_1.verifyFirebaseToken, postController_1.deletePost);
// Public Routes
router.get("/getAllPost", postController_1.getAllPosts);
router.get("/getPostById/:id", postController_1.getPostById);
router.put("/updatePost/:id", authMiddleware_1.verifyFirebaseToken, 
// requireAdmin,
multer_1.default.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
]), postController_1.updatePost);
router.post("/:postId/like", authMiddleware_1.verifyFirebaseToken, postController_1.toggleLikePost);
router.post("/:postId/save", authMiddleware_1.verifyFirebaseToken, postController_1.toggleSavePost);
router.get("/saved", authMiddleware_1.verifyFirebaseToken, postController_1.getSavedPosts);
router.post("/:postId/share", authMiddleware_1.verifyFirebaseToken, postController_1.sharePost);
exports.default = router;
