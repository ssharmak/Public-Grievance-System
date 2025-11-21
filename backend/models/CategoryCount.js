// backend/models/CategoryCount.js
import mongoose from "mongoose";

const categoryCountSchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true, unique: true }, // e.g. "electricity"
    name: { type: String }, // human readable name (optional)
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("CategoryCount", categoryCountSchema);
