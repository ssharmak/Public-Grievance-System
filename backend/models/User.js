/**
 * @file User.js
 * @description Mongoose schema for User accounts.
 * Comprehensive model handling Citizens, Officials, Staff, and Admins.
 * Includes Auth fields, Profile data, Role-Based Access Control (RBAC), and Notification preferences.
 */

import mongoose from "mongoose";

// Sub-schema for user physical address
const addressSchema = new mongoose.Schema(
  {
    houseNameOrNumber: String,
    locality: String,
    landmark: String,
    taluk: String,
    district: String,
    state: String,
    country: String,
    pincode: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    
    gender: { type: String, enum: ["male", "female", "transgender", "other"] },
    dob: { type: Date, required: true },
    
    // Contact Info (Unique Identifiers)
    primaryContact: { type: String, required: true, unique: true },
    secondaryContact: { type: String },
    email: { type: String, required: true, unique: true },
    
    // Authentication
    password: { type: String, required: true },
    
    // Residential Address
    address: addressSchema,
    
    // Role-Based Access Control
    role: {
      type: String,
      enum: ["citizen", "admin", "superadmin", "staff", "official"],
      default: "citizen",
    },
    
    // Official/Staff specific fields
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    // List of category keys this official oversees (e.g. ['electricity', 'water'])
    managedCategories: [{ type: String, default: [] }], 
    
    // Citizen specific
    grievanceHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Grievance" },
    ],
    
    // Notifications & Device Tokens
    // Expo Push Token for mobile notifications
    pushToken: { type: String, unique: true, sparse: true, default: null },
    
    // Account Status
    isActive: { type: Boolean, default: true },
    
    // Verification & Reset flows
    resetPasswordOtp: { type: String, default: null },
    resetPasswordOtpExpires: { type: Date, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    phoneVerificationOtp: { type: String, default: null },
    phoneVerificationOtpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
