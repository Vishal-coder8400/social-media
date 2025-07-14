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
exports.sharePost = exports.getSavedPosts = exports.toggleSavePost = exports.toggleLikePost = exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content, postType, pollOptions } = req.body;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        let images = [];
        let video;
        // ✅ Handle image uploads
        if (req.files && "images" in req.files) {
            const imageFiles = req.files["images"];
            if (imageFiles.length === 0)
                throw new Error("No image file uploaded");
            const uploads = yield Promise.all(imageFiles.map((file) => cloudinary_1.default.uploader.upload(file.path).then((res) => res.secure_url)));
            images = uploads;
        }
        // ✅ Handle video (if applicable)
        if (req.files && "video" in req.files) {
            const videoFile = req.files["video"][0];
            const upload = yield cloudinary_1.default.uploader.upload(videoFile.path, {
                resource_type: "video",
            });
            video = upload.secure_url;
        }
        const post = yield postModel_1.default.create({
            adminId,
            content,
            postType,
            images,
            video,
            pollOptions: postType === "poll" ? JSON.parse(pollOptions || "[]") : [],
        });
        res.status(201).json({ message: "Post created", post });
    }
    catch (err) {
        console.error("Create Post Error:", err);
        res.status(500).json({ message: "Failed to create post", error: err });
    }
});
exports.createPost = createPost;
const getAllPosts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find()
            .sort({ createdAt: -1 })
            .populate("adminId", "name photoURL");
        res.status(200).json({ posts });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch posts", error: err });
    }
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(req.params.id).populate("adminId", "name photoURL");
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json({ post });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch post", error: err });
    }
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { content, postType, pollOptions } = req.body;
    try {
        const post = yield postModel_1.default.findOne({ _id: id, adminId });
        if (!post) {
            res.status(404).json({ message: "Post not found or unauthorized" });
            return;
        }
        let images = post.images || [];
        let video = post.video;
        // ✅ Update images (if new ones provided)
        if (req.files && "images" in req.files) {
            const imageFiles = req.files["images"];
            if (imageFiles.length > 0) {
                const uploads = yield Promise.all(imageFiles.map((file) => cloudinary_1.default.uploader.upload(file.path).then((res) => res.secure_url)));
                images = uploads;
            }
        }
        // ✅ Update video (if new one provided)
        if (req.files && "video" in req.files) {
            const videoFile = req.files["video"][0];
            const upload = yield cloudinary_1.default.uploader.upload(videoFile.path, {
                resource_type: "video",
            });
            video = upload.secure_url;
        }
        // ✅ Update post fields
        post.content = content || post.content;
        post.postType = postType || post.postType;
        post.images = images;
        post.video = video;
        post.pollOptions = postType === "poll" ? JSON.parse(pollOptions || "[]") : [];
        yield post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    }
    catch (err) {
        console.error("Update Post Error:", err);
        res.status(500).json({ message: "Failed to update post", error: err });
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const post = yield postModel_1.default.findOne({ _id: id, adminId });
        if (!post) {
            res.status(404).json({ message: "Post not found or unauthorized" });
            return;
        }
        yield postModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Delete failed", error: err });
    }
});
exports.deletePost = deletePost;
// ✅ Like / Unlike Post
const toggleLikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { postId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const objectUserId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const isLiked = (_b = post.likes) === null || _b === void 0 ? void 0 : _b.some((id) => id.equals(objectUserId));
        if (isLiked) {
            post.likes = post.likes.filter((id) => !id.equals(objectUserId));
        }
        else {
            post.likes.push(objectUserId);
        }
        yield post.save();
        res.status(200).json({
            message: isLiked ? "Post unliked" : "Post liked",
            likesCount: post.likes.length,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to toggle like", error: err });
    }
});
exports.toggleLikePost = toggleLikePost;
// ✅ Save / Unsave Post
const toggleSavePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { postId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const objectUserId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const isSaved = (_b = post.savedBy) === null || _b === void 0 ? void 0 : _b.some((id) => id.equals(objectUserId));
        if (isSaved) {
            post.savedBy = post.savedBy.filter((id) => !id.equals(objectUserId));
        }
        else {
            post.savedBy.push(objectUserId);
        }
        yield post.save();
        res.status(200).json({
            message: isSaved ? "Post unsaved" : "Post saved",
            savedCount: post.savedBy.length,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to toggle save", error: err });
    }
});
exports.toggleSavePost = toggleSavePost;
// ✅ Get All Saved Posts (by User)
const getSavedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const posts = yield postModel_1.default.find({ savedBy: userId })
            .sort({ createdAt: -1 })
            .populate("adminId", "name photoURL");
        res.status(200).json({ savedPosts: posts });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch saved posts", error: err });
    }
});
exports.getSavedPosts = getSavedPosts;
// ✅ Share Post (tracks shareCount & sharedBy for analytics)
const sharePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { postId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    try {
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const alreadyShared = (_b = post.sharedBy) === null || _b === void 0 ? void 0 : _b.some((id) => id.toString() === userId.toString());
        if (!alreadyShared) {
            post.sharedBy.push(new mongoose_1.default.Types.ObjectId(userId));
            post.shareCount += 1;
            yield post.save();
        }
        const shareUrl = `${process.env.FRONTEND_URL}/post/${post._id}`;
        res.status(200).json({
            message: "Post share tracked successfully",
            shareUrl,
            shareCount: post.shareCount,
        });
    }
    catch (err) {
        console.error("Share Post Error:", err);
        res.status(500).json({ message: "Failed to share post", error: err });
    }
});
exports.sharePost = sharePost;
