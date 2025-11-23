import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      required: true,
    },
    oldStatus: String,
    newStatus: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: String,
  },
  { timestamps: true }
);

export default mongoose.model("StatusHistory", statusHistorySchema);
