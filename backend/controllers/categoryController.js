import Category from "../models/Category.js";

export const listCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, department } = req.body;
    const cat = await Category.create({
      name,
      description,
      department,
      createdBy: req.user.id,
    });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
