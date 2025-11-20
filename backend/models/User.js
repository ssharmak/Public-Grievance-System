import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    houseNameOrNumber: { type: String, trim: true },
    locality: { type: String, trim: true },
    landmark: { type: String, trim: true },
    taluk: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },

    gender: {
      type: String,
      enum: ["male", "female", "transgender", "other"],
      required: true, // <-- Added required
    },

    dob: { type: Date, required: true },

    primaryContact: { type: String, required: true, unique: true, trim: true },
    secondaryContact: { type: String, trim: true },

    email: { type: String, required: true, unique: true, trim: true },

    password: { type: String, required: true },

    address: { type: addressSchema, default: {} }, // optional in registration

    role: {
      type: String,
      enum: ["citizen", "admin", "superadmin"],
      default: "citizen",
    },

    grievanceHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Grievance" },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
