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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Placeholder logic
    console.log(`Forgot password requested for: ${email}`);
    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // Placeholder logic
    console.log(`Reset password with token: ${token}`);
    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
