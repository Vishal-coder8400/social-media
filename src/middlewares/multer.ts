import multer from "multer";
import path from "path";

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
const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"), false);
  }
};

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// Export multer upload middleware
export const upload = multer({ storage, fileFilter });
