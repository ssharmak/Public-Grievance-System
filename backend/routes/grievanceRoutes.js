import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createGrievance,
  getMyGrievances,
  getSingleGrievance,
} from "../controllers/grievanceController.js";

const router = express.Router();

// Create a new grievance
router.post("/", verifyToken, createGrievance);

// Get logged-in user's grievance list
router.get("/my", verifyToken, getMyGrievances);

// Get a specific grievance by ID
router.get("/:id", verifyToken, getSingleGrievance);

export default router;
