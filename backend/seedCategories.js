import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  { name: "Electricity & Power", key: "electricity" },
  { name: "Water Supply", key: "water" },
  { name: "Waste Management", key: "waste" },
  { name: "Roads & Infrastructure", key: "roads" },
  { name: "Public Transport", key: "transport" },
  { name: "Public Safety / Police", key: "safety" },
  { name: "Health & Sanitation", key: "health" },
  { name: "Government Services", key: "govt" },
  { name: "Housing & Building", key: "housing" },
  { name: "Environment", key: "environment" },
  { name: "Education", key: "education" },
  { name: "Welfare & Social Justice", key: "welfare" },
  { name: "Others", key: "others" },
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
