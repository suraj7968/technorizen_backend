const express = require("express");
const router = express.Router();
const { checkout, getUserCartProducts, removeProductFromCart } = require("../controllers/checkoutController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, checkout);
router.post("/getUserCartProducts", authMiddleware, getUserCartProducts);
router.post("/getUserCartProducts", authMiddleware, getUserCartProducts);
router.post("/removeProductFromCart", authMiddleware, removeProductFromCart);

module.exports = router;
