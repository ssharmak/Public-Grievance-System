import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grievanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Grievance" },
    notification: {
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
