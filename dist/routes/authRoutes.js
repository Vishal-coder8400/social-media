"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// 👇 Separate endpoints for clarity
router.post("/email-signup", authController_1.emailSignup); // with role: 'admin' or 'user'
router.post("/email-login", authController_1.emailLogin); // login using Firebase ID token
router.post("/phone-signup", authController_1.phoneSignup);
router.post("/phone-login", authController_1.phoneLogin);
exports.default = router;
