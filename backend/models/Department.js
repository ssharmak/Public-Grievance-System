import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // "Electricity Department"
    key: { type: String, required: true, unique: true }, // "electricity_dept"
    description: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
