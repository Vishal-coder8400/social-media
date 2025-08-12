import { Request, Response } from "express";
import { sendOtpWhatsapp } from "../models/whatsappApi";
import { OTPModel } from "../models/whatsappOtpModel";
import { generateOTP, canSendOtp } from "../utils/whatsappOtp";

// Always use env
const authkey = process.env.AUTHKEY || "";
const wid = process.env.WID || "";
const countryCode = process.env.COUNTRY_CODE || "";

/**
 * POST /api/whatsapp/send-otp
 */
export function sendOtp(req: Request, res: Response): void {
  const { mobile, name } = req.body;
  if (!mobile || !name) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  canSendOtp(mobile)
    .then((canSend) => {
      if (!canSend) {
        res.status(429).json({ error: "OTP already sent. Please wait before requesting again." });
        return Promise.reject("rate_limit"); // stop chain
      }
      // Remove old OTPs
      return OTPModel.deleteMany({ phoneNumber: mobile });
    })
    .then(() => {
      const { otp, expiresAt } = generateOTP();
      return sendOtpWhatsapp(authkey, mobile, countryCode, wid, name, otp)
        .then(() => OTPModel.create({ phoneNumber: mobile, otp, expiresAt }))
        .then(() => res.status(200).json({ message: "OTP sent successfully", expiresIn: 60 }));
    })
    .catch((err) => {
      if (err !== "rate_limit") {
        console.error("[SEND OTP ERROR]", err);
        const msg =
          (err && typeof err === "object" && "Message" in err && err.Message) ||
          (err && typeof err === "object" && "error" in err && err.error) ||
          (typeof err === "string" && err) ||
          "Internal error";
        res.status(500).json({ error: msg });
      }
    });
}

/**
 * POST /api/whatsapp/verify-otp
 */
export function verifyOtpController(req: Request, res: Response): void {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  OTPModel.findOne({ phoneNumber: mobile, otp })
    .then(record => {
      if (!record) return res.status(400).json({ error: "Invalid OTP" });
      if (record.expiresAt.getTime() < Date.now()) {
        OTPModel.deleteOne({ _id: record._id }).then(() => {
          res.status(400).json({ error: "OTP expired" });
        });
        return;
      }
      OTPModel.deleteOne({ _id: record._id }).then(() => {
        res.status(200).json({ message: "OTP verified successfully" });
      });
    })
    .catch(err => {
      console.error("[VERIFY OTP ERROR]", err);
      res.status(500).json({ error: "Internal error" });
    });
}