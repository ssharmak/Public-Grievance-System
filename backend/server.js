/**
 * @file server.js
 * @description Main Express Server Entry Point.
 * Configures Middleware (CORS, JSON), Routes, and Database Connection.
 * Initializes Email Service and starts the HTTP server.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { connectDB } from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js"; // Note: Direct import kept if used distinctly
import { createEmailTransporter } from "./config/emailConfig.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Local uploads fallback

// Mount Main API Routes
app.use("/api", routes);

// Health Check Endpoint
app.get("/", (req, res) => res.send("PGS API running"));

// Server Initialization
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  // Initialize External Services
  try {
    createEmailTransporter();
    console.log("📧 Email service initialized");
  } catch (error) {
    console.warn("⚠️  Email service not configured. Email notifications will be disabled.");
    console.warn("   Please configure SMTP settings in .env file");
  }
  
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
