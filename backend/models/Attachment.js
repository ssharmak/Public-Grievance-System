import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    grievanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Grievance" },
    fileName: String,
    filePath: String,
    fileType: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Attachment", attachmentSchema);
