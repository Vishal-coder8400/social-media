"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/addComment", authMiddleware_1.verifyFirebaseToken, roleMiddleware_1.requireUser, commentController_1.addComment);
router.post("/replyCommnet/:commentId/reply", authMiddleware_1.verifyFirebaseToken, roleMiddleware_1.requireAdmin, commentController_1.replyToComment);
router.delete("/delete/:commentId", authMiddleware_1.verifyFirebaseToken, commentController_1.deleteComment);
router.get("/getpostComment/:postId", commentController_1.getCommentsByPost);
router.post("/:commentId/like", authMiddleware_1.verifyFirebaseToken, commentController_1.toggleLikeComment);
exports.default = router;
