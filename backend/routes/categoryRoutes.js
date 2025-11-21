import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  listCategories,
  createCategory,
} from "../controllers/categoryController.js";
import { verifyRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, listCategories);
router.post(
  "/",
  verifyToken,
  verifyRole(["superadmin", "admin"]),
  createCategory
);

export default router;
