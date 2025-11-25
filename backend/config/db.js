import mongoose from "mongoose";

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
