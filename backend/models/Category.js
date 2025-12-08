/**
 * @file Category.js
 * @description Mongoose schema for Grievance Categories.
 * Categories help classify grievances (e.g., "Street Light", "Garbage") and are used 
 * to route grievances to the correct department or official.
 */

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // Human-readable display name, e.g., "Electricity & Power"
    name: { type: String, required: true, unique: true },
    
    // Internal identifier key, e.g., "electricity"
    key: { type: String, required: true, unique: true },
    
    // Brief description of what falls under this category
    description: String,
    
    // Whether this category is currently selectable by users
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
