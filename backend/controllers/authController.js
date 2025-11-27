import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// Generate Token Helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.firstName,
      email: user.email,
      primaryContact: user.primaryContact,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Helper to format phone number
    const formatPhone = (phone) => {
      if (!phone) return phone;
      if (phone.startsWith('+')) return phone;
      return `+91${phone}`;
    };

    // Re-writing the destructuring block to include secondaryContact
    const {
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      primaryContact: rawPrimary,
      secondaryContact: rawSecondary,
      email,
      password: rawPassword,
    } = req.body;

    const primaryContact = formatPhone(rawPrimary);
    const secondaryContact = formatPhone(rawSecondary);

    const exists = await User.findOne({
      $or: [{ email }, { primaryContact }],
    });

    if (exists) {
      return res.status(400).json({
        message: "Email or phone already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await User.create({
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      primaryContact,
      secondaryContact,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { primaryContact: emailOrPhone }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        managedCategories: user.managedCategories,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

import { sendSMS } from "../utils/smsService.js";

export const forgotPasswordOtp = async (req, res) => {
  try {
    const { primaryContact } = req.body;

    // Ensure +91 prefix if missing (basic check, though frontend handles it)
    const formattedContact = primaryContact.startsWith('+') ? primaryContact : `+91${primaryContact}`;

    const user = await User.findOne({ primaryContact: formattedContact });
    if (!user) {
      return res.status(404).json({ message: "User with this contact number not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry (e.g., 10 minutes)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = expires;
    await user.save();

    // Send SMS
    const message = `Your OTP for password reset is ${otp}. Valid for 10 minutes.`;
    await sendSMS(user.primaryContact, message);

    res.json({ message: "OTP sent to your registered mobile number." });
  } catch (err) {
    console.error("FORGOT PASSWORD OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { primaryContact, otp, newPassword } = req.body;

    const formattedContact = primaryContact.startsWith('+') ? primaryContact : `+91${primaryContact}`;

    const user = await User.findOne({
      primaryContact: formattedContact,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() }, // Check if not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // Clear OTP fields
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    await user.save();

    // Send confirmation SMS
    const timestamp = new Date().toLocaleString();
    const confirmMessage = `Your password was successfully changed on ${timestamp}. If this wasn't you, contact support immediately.`;
    await sendSMS(user.primaryContact, confirmMessage);

    res.json({ message: "Password reset successfully. Please login with your new password." });
  } catch (err) {
    console.error("RESET PASSWORD OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendPhoneVerificationOtp = async (req, res) => {
  try {
    // User ID comes from auth middleware
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({ message: "Phone number already verified" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry (10 minutes)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.phoneVerificationOtp = otp;
    user.phoneVerificationOtpExpires = expires;
    await user.save();

    // Send SMS
    const message = `Your OTP for phone verification is ${otp}. Valid for 10 minutes.`;
    await sendSMS(user.primaryContact, message);

    res.json({ message: "Verification OTP sent to your registered mobile number." });
  } catch (err) {
    console.error("SEND VERIFICATION OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPhoneOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    const user = await User.findOne({
      _id: userId,
      phoneVerificationOtp: otp,
      phoneVerificationOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isPhoneVerified = true;
    user.phoneVerificationOtp = null;
    user.phoneVerificationOtpExpires = null;
    await user.save();

    res.json({ message: "Phone number verified successfully!" });
  } catch (err) {
    console.error("VERIFY PHONE OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
