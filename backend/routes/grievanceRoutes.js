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

const router = express.Router();

// Citizen Routes
router.post("/", verifyToken, createGrievance);
router.get("/me", verifyToken, getMyGrievances);
router.get("/:id", verifyToken, getSingleGrievance);

// Admin Routes
router.get("/admin/all", verifyToken, isAdmin, adminGetAll);
router.get("/admin/:id", verifyToken, isAdmin, adminGetOne);
router.patch("/admin/status/:id", verifyToken, isAdmin, updateStatus);
router.patch("/admin/assign/:id", verifyToken, isAdmin, assignGrievance);

export default router;
