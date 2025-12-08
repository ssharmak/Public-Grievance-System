/**
 * @file Notification.js
 * @description Mongoose schema for User Notifications.
 * Stores in-app alerts and logs of sent messages (Email/SMS).
 * Used to display a history of notifications to the user inside the application.
 */

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Recipient User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Delivery Channel Type
    type: {
      type: String,
      enum: ["email", "sms", "inapp"],
      default: "inapp",
    },
    
    // Notification Content
    title: String,
    message: String,
    
    // Arbitrary metadata (e.g., related { grievanceId: "..." }) for deeplinking
    meta: {}, 
    
    // Read status
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
