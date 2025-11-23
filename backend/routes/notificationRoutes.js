import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMyNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/my", verifyToken, getMyNotifications);

export default router;
