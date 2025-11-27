import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import { registerPushToken } from "../controllers/userController.js";

import {
  sendPhoneVerificationOtp,
  verifyPhoneOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.patch("/me", verifyToken, updateMyProfile);
router.put("/register-token", verifyToken, registerPushToken);

// Phone Verification
router.post("/verify-phone/send", verifyToken, sendPhoneVerificationOtp);
router.post("/verify-phone/verify", verifyToken, verifyPhoneOtp);

export default router;
