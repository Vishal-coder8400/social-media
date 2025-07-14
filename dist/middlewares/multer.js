"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ✅ Ensure uploads folder exists
const uploadsDir = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// ✅ Disk Storage (temporary upload folder)
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadsDir); // Save files temporarily to /uploads
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
// ✅ Filter only images & videos
const fileFilter = (_req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const allowedExt = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov", ".avi", ".mkv"];
    if (allowedExt.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};
// ✅ Export multer instance
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.default = upload;
