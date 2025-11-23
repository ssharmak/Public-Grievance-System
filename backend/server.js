import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { connectDB } from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);

// Route mount
app.use("/api", routes);

// Health
app.get("/", (req, res) => res.send("PGS API running"));

// Connect DB & start
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
