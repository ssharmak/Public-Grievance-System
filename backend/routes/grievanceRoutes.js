/**
 * @file grievanceRoutes.js
 * @description Routes for grievance submission and management.
 * Separation between Citizen actions and Admin/Official actions.
 */

import express from "express";
import {
  createGrievance,
  getMyGrievances,
  getSingleGrievance,
  adminGetAll,
  adminGetOne,
  updateStatus,
  assignGrievance,
} from "../controllers/grievanceController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/grievances
 * @desc Submit a new grievance with optional file attachments (Photos/PDF).
 */
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "pdf", maxCount: 1 },
  ]),
  createGrievance
);

/**
 * @route GET /api/grievances/me
 * @desc Get grievance history for the logged-in citizen.
 */
router.get("/me", verifyToken, getMyGrievances);

/**
 * @route GET /api/grievances/:id
 * @desc Get details of a single grievance (Citizen view).
 */
router.get("/:id", verifyToken, getSingleGrievance);

// --- Legacy/Direct Admin Routes (Refactor: Consider moving to adminRoutes.js fully) ---

/**
 * @route GET /api/grievances/admin/all
 * @desc Admin: List all grievances.
 */
router.get("/admin/all", verifyToken, isAdmin, adminGetAll);

/**
 * @route GET /api/grievances/admin/:id
 * @desc Admin: Get single grievance details.
 */
router.get("/admin/:id", verifyToken, isAdmin, adminGetOne);

/**
 * @route PATCH /api/grievances/admin/status/:id
 * @desc Admin: Update status (Legacy).
 */
router.patch("/admin/status/:id", verifyToken, isAdmin, updateStatus);

/**
 * @route PATCH /api/grievances/admin/assign/:id
 * @desc Admin: Assign official (Legacy).
 */
router.patch("/admin/assign/:id", verifyToken, isAdmin, assignGrievance);

export default router;
