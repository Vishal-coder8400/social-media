"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // ✅ Import combined routes
const postRoutes_1 = __importDefault(require("./routes/postRoutes")); // ✅ Import combined routes
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ✅ Mount all routes under `/api`
app.use("/api/auth", authRoutes_1.default);
app.use("/api/post", postRoutes_1.default);
app.use("/api/comment", commentRoutes_1.default);
exports.default = app;
