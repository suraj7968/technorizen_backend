const express = require("express");
const { addCategory, getCategories } = require("../controllers/categoryController");
const router = express.Router();

// Add a new category
router.post("/add", addCategory);
router.get("/getCategories", getCategories);

module.exports = router;
