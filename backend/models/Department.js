/**
 * @file Department.js
 * @description Mongoose schema for Government Departments.
 * Represents organizational units responsible for handling specific categories of grievances.
 */

import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    // Display name, e.g., "Electricity Department"
    name: { type: String, required: true, unique: true }, 
    
    // Internal identifier, e.g., "electricity_dept"
    key: { type: String, required: true, unique: true }, 
    
    // Description of the department's responsibilities
    description: String,
    
    // Status of the department
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
