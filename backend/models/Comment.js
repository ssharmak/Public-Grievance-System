/**
 * @file Comment.js
 * @description Mongoose schema for Comments on Grievances.
 * Allows users and officials to communicate, providing updates or requesting information
 * regarding a specific grievance.
 */

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // The parent Grievance ID
    grievanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      required: true,
    },
    
    // The author of the comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Content of the comment
    commentText: { type: String, required: true },
    
    // Optional array of attachment paths/URLs
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
