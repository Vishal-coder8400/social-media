"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLikeComment = exports.getCommentsByPost = exports.deleteComment = exports.replyToComment = exports.addComment = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
// ✅ Add a comment (User - only once per post)
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const existingComment = yield commentModel_1.default.findOne({ postId, userId });
        if (existingComment) {
            res.status(400).json({ message: "You have already commented on this post." });
            return;
        }
        const comment = yield commentModel_1.default.create({
            postId,
            userId,
            content,
        });
        res.status(201).json({ message: "Comment added successfully", comment });
    }
    catch (error) {
        console.error("Add Comment Error:", error);
        res.status(500).json({ message: "Failed to add comment", error });
    }
});
exports.addComment = addComment;
// ✅ Admin reply to a comment (only once)
const replyToComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { commentId } = req.params;
    const { content } = req.body;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!mongoose_1.default.Types.ObjectId.isValid(commentId)) {
        res.status(400).json({ message: "Invalid comment ID format" });
        return;
    }
    try {
        const comment = yield commentModel_1.default.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        if ((_b = comment.reply) === null || _b === void 0 ? void 0 : _b.content) {
            res.status(400).json({ message: "Already replied to this comment." });
            return;
        }
        comment.reply = {
            content,
            adminId,
            createdAt: new Date(),
        };
        yield comment.save();
        res.status(200).json({ message: "Reply added successfully", comment });
    }
    catch (error) {
        console.error("Reply Error:", error);
        res.status(500).json({ message: "Failed to reply to comment", error });
    }
});
exports.replyToComment = replyToComment;
// ✅ Delete comment (User or Admin)
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const currentUser = req.user;
    try {
        const comment = yield commentModel_1.default.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        const isOwner = comment.userId.toString() === currentUser._id.toString();
        const isAdmin = currentUser.role === "admin";
        if (!isOwner && !isAdmin) {
            res.status(403).json({ message: "Unauthorized to delete this comment" });
            return;
        }
        yield commentModel_1.default.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ message: "Failed to delete comment", error });
    }
});
exports.deleteComment = deleteComment;
// ✅ Get all comments for a post with pagination
const getCommentsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
        res.status(400).json({ message: "Invalid post ID format" });
        return;
    }
    try {
        const totalComments = yield commentModel_1.default.countDocuments({ postId });
        const comments = yield commentModel_1.default.find({ postId })
            .populate("userId", "name photoURL")
            .populate("reply.adminId", "name photoURL")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({
            totalComments,
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit),
            comments,
        });
    }
    catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ message: "Failed to fetch comments", error });
    }
});
exports.getCommentsByPost = getCommentsByPost;
// ✅ Like/Unlike a comment
const toggleLikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { commentId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const comment = yield commentModel_1.default.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        const alreadyLiked = comment.likes.includes(userId);
        if (alreadyLiked) {
            comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
        }
        else {
            comment.likes.push(userId);
        }
        yield comment.save();
        res.status(200).json({
            message: alreadyLiked ? "Comment unliked" : "Comment liked",
            likesCount: comment.likes.length,
        });
    }
    catch (error) {
        console.error("Toggle Like Error:", error);
        res.status(500).json({ message: "Failed to like/unlike comment", error });
    }
});
exports.toggleLikeComment = toggleLikeComment;
