import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { connectDB } from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { createEmailTransporter } from "./config/emailConfig.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Route mount
app.use("/api", routes);

// Health
app.get("/", (req, res) => res.send("PGS API running"));

// Connect DB & start
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  // Initialize email transporter
  try {
    createEmailTransporter();
    console.log("📧 Email service initialized");
  } catch (error) {
    console.warn("⚠️  Email service not configured. Email notifications will be disabled.");
    console.warn("   Please configure SMTP settings in .env file");
  }
  
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
