import User from "../models/User.js";

// @route PUT /api/profile/register-token
// @desc Register push token for the user
// @access Private
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
