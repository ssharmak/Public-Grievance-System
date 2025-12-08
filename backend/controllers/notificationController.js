/**
 * @file notificationController.js
 * @description Controller for checking and sending notifications.
 * Handles manually sending notifications and retrieving a user's notification history.
 */

import User from "../models/User.js";

/**
 * Send a push notification manually.
 * (Primarily for testing or admin broadcasts)
 * @route POST /api/notifications/send
 * @access Private (Admin)
 */
export const sendNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    
    // Dynamic import to avoid potential circular dependencies
    const { createAndSendNotification } = await import("../utils/notificationService.js");
    
    await createAndSendNotification(userId, title, message);
    
    res.json({ message: "Notification sent" });
  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get the current user's notifications.
 * Returns the latest 50 notifications.
 * @route GET /api/notifications
 * @access Private
 */
export const getMyNotifications = async (req, res) => {
  try {
    const Notification = (await import("../models/Notification.js")).default;
    const list = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(list);
  } catch (err) {
    console.error("NOTIF ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
