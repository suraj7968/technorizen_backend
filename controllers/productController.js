const Product = require("../models/Product");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/product/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
}).single("image");

// Add product
exports.addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err.message });
    }

    const { name, categoryId, price } = req.body;
    const image = req.file ? req.file.path : null;

    try {
      const product = new Product({ name, categoryId, price, image });
      await product.save();

      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// Update product
exports.updateProduct = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Image upload failed", error: err.message });
      }
  
      const { name, categoryId, price, productId } = req.body;
  
      try {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }  
        // Delete the old image if a new one is uploaded
        if (req.file && product.image) {
          const oldImagePath = path.resolve(product.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
  
        const updateData = {
          name: name || product.name,
          categoryId: categoryId || product.categoryId,
          price: price || product.price,
          image: req.file ? req.file.path : product.image,
        };
  
        // Use productId instead of id
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
          new: true,
        });
  
        res
          .status(200)
          .json({ message: "Product updated successfully", updatedProduct });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
};

// Delete product
exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;  
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found", status: false });
      }
  
      if (product.image) {
        const imagePath = path.resolve(product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      await Product.findByIdAndDelete(productId);
  
      res.status(200).json({ message: "Product deleted successfully", status: true });
    } catch (error) {
      console.error("Error deleting product:", error.message); // Log the error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.fetchProducts = async (req, res) => {
  const { categoryId, minPrice, maxPrice } = req.query;

  try {
    const filters = {};

    if (categoryId) filters.categoryId = categoryId;
    if (minPrice) filters.price = { $gte: minPrice };
    if (maxPrice) filters.price = { ...filters.price, $lte: maxPrice };

    const products = await Product.find(filters).populate("categoryId");

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

