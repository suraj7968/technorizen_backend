const Category = require("../models/Category");

// Add a new category
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists", status: false });
    }

    // Create a new category
    const category = new Category({ name });
    await category.save();

    res.status(201).json({ message: "Category added successfully", category, status: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found", status: false });
    }

    res.status(200).json({ message: "Categories fetched successfully", categories, status: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
