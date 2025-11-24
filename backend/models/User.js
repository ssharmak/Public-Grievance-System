// backend/models/User.js
import mongoose from "mongoose";

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
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "transgender", "other"] },
    dob: { type: Date, required: true },
    primaryContact: { type: String, required: true, unique: true },
    secondaryContact: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: addressSchema,
    role: {
      type: String,
      enum: ["citizen", "admin", "superadmin", "staff"],
      default: "citizen",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    grievanceHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Grievance" },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
