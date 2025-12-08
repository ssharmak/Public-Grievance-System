/**
 * @file authRoutes.js
 * @description Routes for user authentication and authorization.
 * Handles registration, login, and password reset workflows.
 */

import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  forgotPasswordOtp,
  resetPasswordWithOtp,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user (Citizen).
 * Validates strictly for required fields and password strength.
 */
router.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("First name required"),
    body("lastName").notEmpty().withMessage("Last name required"),
    body("gender").notEmpty().withMessage("Gender required"),
    body("dob")
      .notEmpty()
      .withMessage("DOB required")
      .isISO8601()
      .withMessage("DOB must be a valid date"),
    body("primaryContact").notEmpty().withMessage("Primary contact required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Za-z]/)
      .withMessage("Password must contain letters")
      .matches(/[0-9]/)
      .withMessage("Password must contain numbers")
      .matches(/[!@#$%^&*]/)
      .withMessage("Password must contain a special character"),
  ],
  register
);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT token.
 */
router.post(
  "/login",
  [
    body("emailOrPhone").notEmpty().withMessage("Email or phone required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  login
);

/**
 * @route POST /api/auth/forgot-password-otp
 * @desc Step 1 of Password Reset: Request OTP.
 */
router.post(
  "/forgot-password-otp",
  [body("primaryContact").notEmpty().withMessage("Primary contact required")],
  forgotPasswordOtp
);

/**
 * @route POST /api/auth/reset-password-otp
 * @desc Step 2 of Password Reset: Verify OTP and set new password.
 */
router.post(
  "/reset-password-otp",
  [
    body("primaryContact").notEmpty().withMessage("Primary contact required"),
    body("otp").notEmpty().withMessage("OTP is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  resetPasswordWithOtp
);

export default router;
