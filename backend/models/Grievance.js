import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    grievanceId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      name: String,
      email: String,
      primaryContact: String,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    title: { type: String, required: true },
    description: { type: String },
    attachments: [{ type: String }], // local file paths or URLs
    status: {
      type: String,
      enum: ["Submitted", "In Review", "Assigned", "Resolved", "Closed"],
      default: "Submitted",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
