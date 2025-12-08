/**
 * @file StatusHistory.js
 * @description Mongoose schema for tracking Grievance lifecycle events.
 * Acts as an audit trail for every status change, assignment, or comment added to a grievance.
 * Useful for displaying a timeline of events.
 */

import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    // The Grievance being updated
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      required: true,
    },
    
    // Previous Status (optional, if tracking transition)
    oldStatus: String,
    
    // New Status applied
    newStatus: { type: String, required: true },
    
    // User who made the change
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // Reason for change or internal note
    note: String, 
  },
  { timestamps: true }
);

export default mongoose.model("StatusHistory", statusHistorySchema);
