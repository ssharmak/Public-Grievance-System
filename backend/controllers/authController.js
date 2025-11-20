// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

export const register = async (req, res) => {
  // server-side validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return first meaningful error
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      primaryContact,
      email,
      password,
    } = req.body;

    // ensure dob is convertable
    const dobDate = dob ? new Date(dob) : null;
    if (!dobDate || isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth" });
    }

    const exists = await User.findOne({ $or: [{ email }, { primaryContact }] });
    if (exists)
      return res
        .status(400)
        .json({ message: "Email or primary contact already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      middleName,
      lastName,
      gender,
      dob: dobDate,
      primaryContact,
      email,
      password: hashed,
    });

    // Do not return password
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        primaryContact: user.primaryContact,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    // if duplicate key error (unique), provide friendly message
    if (err.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0];
      return res.status(400).json({ message: `${key} already exists` });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { emailOrPhone, password } = req.body;

    // allow login by email or primaryContact
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { primaryContact: emailOrPhone }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        primaryContact: user.primaryContact,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
