/**
 * @file CategoryCount.js
 * @description Mongoose schema for caching/tracking grievance counts per category.
 * This can be used for analytics or displaying popular categories without running expensive aggregation queries.
 */

import mongoose from "mongoose";

const categoryCountSchema = new mongoose.Schema(
  {
    // The unique key of the category (must match Category.key)
    categoryId: { type: String, required: true, unique: true },
    
    // Optional human-readable name for easier debugging/display
    name: { type: String },
    
    // The requested count for this category
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("CategoryCount", categoryCountSchema);
