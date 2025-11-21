import User from "../models/User.js";

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
    // sanitize incoming payload
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
