import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.patch("/me", verifyToken, updateMyProfile);

export default router;
