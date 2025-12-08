/**
 * @file userController.js
 * @description Controller for general user operations not covered by Auth or Profile.
 * Currently handles Push Notification token registration.
 */

import User from "../models/User.js";

/**
 * Register a Push Notification Token (Expo).
 * Associates the device token with the user profile for sending alerts.
 * @route PUT /api/user/push-token (or referenced via auth route structure)
 */
export const registerPushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ message: "Push token is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { pushToken } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Push token registered successfully" });
  } catch (err) {
    console.error("REGISTER TOKEN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
