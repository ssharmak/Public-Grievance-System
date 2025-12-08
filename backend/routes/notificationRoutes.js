/**
 * @file notificationRoutes.js
 * @description Routes for notification management.
 */

import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  sendNotification,
  getMyNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * @route GET /api/notifications
 * @desc Get list of notifications for the authenticated user.
 */
router.get("/", verifyToken, getMyNotifications);

/**
 * @route POST /api/notifications/send
 * @desc Manually send a notification (Internal/Testing).
 */
router.post("/send", verifyToken, sendNotification);

export default router;
