"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Allowed file extensions
const allowedExt = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
];
// File filter to validate extensions
const fileFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExt.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};
// Use memory storage instead of disk storage
const storage = multer_1.default.memoryStorage();
// Export multer upload middleware
exports.upload = (0, multer_1.default)({ storage, fileFilter });
