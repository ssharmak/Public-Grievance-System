import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    grievanceId: { type: String, required: true, unique: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // null for anonymous
    },

    createdBy: {
      name: String,
      email: String,
      primaryContact: String,
    },

    // 👉 No more ObjectId references for category
    category: {
      key: { type: String, required: true }, // ex: "electricity"
      name: { type: String, required: true }, // ex: "Electricity & Power"
    },

    title: { type: String, required: true },
    description: { type: String },

    attachments: [{ type: String }],

    status: {
      type: String,
      enum: ["Submitted", "In Review", "Assigned", "Resolved", "Closed"],
      default: "Submitted",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    location: { type: String },

    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Grievance", grievanceSchema);
