/**
 * @file profileController.js
 * @description Controller for managing user profiles.
 * Handles fetching and updating current user's personal information.
 */

import User from "../models/User.js";

/**
 * Get current user's profile.
 * Excludes sensitive fields like password.
 * @route GET /api/profile/me
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.log("GET PROFILE ERROR", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update current user's profile.
 * Filters input to only allow editing relevant fields (contact, address, etc.).
 * @route PUT /api/profile/update
 */
export const updateMyProfile = async (req, res) => {
  try {
    const allowed = [
      "firstName",
      "middleName",
      "lastName",
      "gender",
      "dob",
      "primaryContact",
      "secondaryContact",
      "email",
      "address",
    ];
    
    // Sanitize incoming payload to prevent overwriting restricted fields (like role)
    const payload = {};
    for (const k of allowed)
      if (req.body[k] !== undefined) payload[k] = req.body[k];

    const updated = await User.findByIdAndUpdate(req.user.id, payload, {
      new: true,
    }).select("-password");
    
    return res.json(updated);
  } catch (err) {
    console.log("UPDATE PROFILE ERROR", err);
    return res.status(500).json({ message: "Update failed" });
  }
};
