import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  sendNotification,
  getMyNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", verifyToken, getMyNotifications);
router.post("/send", verifyToken, sendNotification);

export default router;
