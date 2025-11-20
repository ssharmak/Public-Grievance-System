// backend/routes/authRoutes.js
import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Register validations
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

// Login validations
router.post(
  "/login",
  [
    body("emailOrPhone").notEmpty().withMessage("Email or phone required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  login
);

export default router;
