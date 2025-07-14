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
exports.phoneLogin = exports.phoneSignup = exports.emailLogin = exports.emailSignup = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const userModel_1 = __importDefault(require("../models/userModel"));
// ✅ Email SIGNUP
const emailSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken, role } = req.body;
    if (!idToken || !role) {
        res.status(400).json({ message: "idToken and role are required" });
        return;
    }
    if (role !== "admin" && role !== "user") {
        res.status(400).json({ message: "Role must be either 'admin' or 'user'" });
        return;
    }
    try {
        const decoded = yield firebase_1.default.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decoded;
        const existingUser = yield userModel_1.default.findOne({ uid });
        if (existingUser) {
            res.status(400).json({ message: "User already exists. Please login instead." });
            return;
        }
        const user = yield userModel_1.default.create({
            uid,
            name: name || "Anonymous",
            email,
            photoURL: picture,
            role, // ⬅️ Store role
        });
        res.status(201).json({ message: `${role} signup successful`, user });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.emailSignup = emailSignup;
// ✅ Email LOGIN
const emailLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    if (!idToken) {
        res.status(400).json({ message: "idToken is required" });
        return;
    }
    try {
        const decoded = yield firebase_1.default.auth().verifyIdToken(idToken);
        const { uid } = decoded;
        const user = yield userModel_1.default.findOne({ uid });
        if (!user) {
            res.status(404).json({ message: "User not found. Please signup first." });
            return;
        }
        res.status(200).json({ message: `${user.role} login successful`, user });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.emailLogin = emailLogin;
// ✅ PHONE SIGNUP
// ✅ Phone SIGNUP
const phoneSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken, role } = req.body;
    if (!idToken || !role) {
        res.status(400).json({ message: "idToken and role are required" });
        return;
    }
    if (role !== "admin" && role !== "user") {
        res.status(400).json({ message: "Role must be either 'admin' or 'user'" });
        return;
    }
    try {
        const decoded = yield firebase_1.default.auth().verifyIdToken(idToken);
        const { uid, name, phone_number, picture } = decoded;
        if (!uid) {
            res.status(400).json({ message: "Invalid Firebase token: UID is missing" });
            return;
        }
        const existingUser = yield userModel_1.default.findOne({ uid });
        if (existingUser) {
            res.status(400).json({ message: "User already exists. Please login instead." });
            return;
        }
        const user = yield userModel_1.default.create({
            uid,
            name: name || "Anonymous",
            photoURL: picture,
            role,
            email: "", // or skip if not provided
        });
        res.status(201).json({ message: `${role} signup successful with phone`, user });
    }
    catch (err) {
        console.error("Phone signup error:", err);
        res.status(500).json({ message: "Something went wrong during signup" });
    }
});
exports.phoneSignup = phoneSignup;
// ✅ PHONE LOGIN
// ✅ Phone LOGIN
const phoneLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    if (!idToken) {
        res.status(400).json({ message: "idToken is required" });
        return;
    }
    try {
        const decoded = yield firebase_1.default.auth().verifyIdToken(idToken);
        const { uid } = decoded;
        const user = yield userModel_1.default.findOne({ uid });
        if (!user) {
            res.status(404).json({ message: "User not found. Please signup first." });
            return;
        }
        res.status(200).json({ message: `${user.role} login successful with phone`, user });
    }
    catch (err) {
        console.error("Phone login error:", err);
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.phoneLogin = phoneLogin;
