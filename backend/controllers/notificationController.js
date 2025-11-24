import User from "../models/User.js";

// Push token registration endpoints removed

// @route POST /api/notifications/send
// @desc Send a push notification manually (for testing/admin)
// @access Private (Admin only - middleware to be added in route)
export const sendNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    
    // Dynamic import to avoid circular dependency issues if any
    const { createAndSendNotification } = await import("../utils/notificationService.js");
    
    await createAndSendNotification(userId, title, message);
    
    res.json({ message: "Notification sent" });
  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/notifications
// @desc Get user notifications
// @access Private
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
