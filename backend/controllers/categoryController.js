/**
 * @file categoryController.js
 * @description Controller for managing problem categories.
 * Allows creating, listing, updating, and disabling (soft delete) categories.
 */

import Category from "../models/Category.js";

/**
 * Create a new Category.
 * @route POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const { name, key, description } = req.body;
    const c = await Category.create({ name, key, description });
    res.status(201).json(c);
  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all active Categories.
 * Sorted alphabetically by name.
 * @route GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    const list = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(list);
  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update a Category.
 * @route PUT /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("UPDATE CATEGORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a Category (Soft Delete).
 * Sets isActive to false instead of removing from DB.
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("DELETE CATEGORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
