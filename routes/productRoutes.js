const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

router.post("/add", addProduct);

router.post("/update", updateProduct);

router.post("/getProductById", getProductById);

router.delete("/delete", deleteProduct);

router.get("/fetchProducts", fetchProducts);

module.exports = router;
