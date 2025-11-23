import express from "express";
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// citizen/app
router.get("/", getCategories);

// superadmin
router.post("/", verifyToken, isSuperAdmin, createCategory);
router.patch("/:id", verifyToken, isSuperAdmin, updateCategory);
router.delete("/:id", verifyToken, isSuperAdmin, deleteCategory);

export default router;
