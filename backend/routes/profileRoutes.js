/**
 * @file profileRoutes.js
 * @description Routes for user profile management.
 * Includes profile viewing, updating, and phone verification.
 */

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

/**
 * @route GET /api/profile/me
 * @desc Get current user profile.
 */
router.get("/me", verifyToken, getMyProfile);

/**
 * @route PATCH /api/profile/me
 * @desc Update current user profile details.
 */
router.patch("/me", verifyToken, updateMyProfile);

/**
 * @route PUT /api/profile/register-token
 * @desc Register Expo Push Token for device.
 */
router.put("/register-token", verifyToken, registerPushToken);

/**
 * @route POST /api/profile/verify-phone/send
 * @desc Send OTP for phone number verification.
 */
router.post("/verify-phone/send", verifyToken, sendPhoneVerificationOtp);

/**
 * @route POST /api/profile/verify-phone/verify
 * @desc Verify OTP to confirm phone number.
 */
router.post("/verify-phone/verify", verifyToken, verifyPhoneOtp);

export default router;
