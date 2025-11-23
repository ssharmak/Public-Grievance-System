import express from "express";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import grievanceRoutes from "./grievanceRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/grievances", grievanceRoutes);
router.use("/categories", categoryRoutes);
router.use("/notifications", notificationRoutes);

export default router;
