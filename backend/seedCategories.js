import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  { name: "Electricity & Power" },
  { name: "Water Supply" },
  { name: "Waste Management" },
  { name: "Roads & Infrastructure" },
  { name: "Public Transport" },
  { name: "Public Safety / Police" },
  { name: "Health & Sanitation" },
  { name: "Government Services" },
  { name: "Housing & Building" },
  { name: "Environment" },
  { name: "Education" },
  { name: "Welfare & Social Justice" },
  { name: "Others" },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log("✔ Categories Inserted Successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
