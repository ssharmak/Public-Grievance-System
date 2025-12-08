/**
 * @file categoryRoutes.js
 * @description Routes for managing categories.
 * Public access for listing, Super Admin access for modifications.
 */

import express from "express";
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc List all active categories. (Public)
 */
router.get("/", getCategories);

/**
 * @route POST /api/categories
 * @desc Create a new category. (Super Admin)
 */
router.post("/", verifyToken, isSuperAdmin, createCategory);

/**
 * @route PATCH /api/categories/:id
 * @desc Update an existing category. (Super Admin)
 */
router.patch("/:id", verifyToken, isSuperAdmin, updateCategory);

/**
 * @route DELETE /api/categories/:id
 * @desc Soft delete a category. (Super Admin)
 */
router.delete("/:id", verifyToken, isSuperAdmin, deleteCategory);

export default router;
