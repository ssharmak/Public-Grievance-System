import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const list = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(list);
  } catch (err) {
    console.error("NOTIF ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
