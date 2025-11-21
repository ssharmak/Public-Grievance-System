import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    grievanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentText: { type: String, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
