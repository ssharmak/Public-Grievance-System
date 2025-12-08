/**
 * Database Configuration
 * 
 * This file handles the connection to the MongoDB database using Mongoose.
 * It includes a retry mechanism to ensure the application can handle temporary
 * database unavailability during startup.
 */

import mongoose from "mongoose";

/**
 * Connects to the MongoDB database.
 * 
 * This function attempts to connect to the MongoDB instance specified by the URI.
 * It retries the connection up to a maximum number of times (MAX_RETRIES) with a delay
 * between attempts if the initial connection fails.
 * 
 * @param {string} uri - The MongoDB connection string.
 * @returns {Promise<void>} - A promise that resolves when the connection is successful.
 */
export const connectDB = async (uri) => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(uri);
      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      retries++;
      console.error(`❌ MongoDB connection error (Attempt ${retries}/${MAX_RETRIES}):`, err.message);
      
      if (retries >= MAX_RETRIES) {
        console.error("❌ Max retries reached. Exiting.");
        process.exit(1);
      }
      
      console.log("🔄 Retrying in 5 seconds...");
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};
