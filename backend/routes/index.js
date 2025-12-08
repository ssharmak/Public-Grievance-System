/**
 * @file index.js
 * @description Main router entry point.
 * Aggregates all submodule routes into the main /api path.
 */

import express from "express";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import grievanceRoutes from "./grievanceRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

// Mount sub-routes
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/grievances", grievanceRoutes);
router.use("/categories", categoryRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);

export default router;
