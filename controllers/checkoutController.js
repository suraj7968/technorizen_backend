const Product = require("../models/Product");
const UserCart = require('../models/UserCart');

exports.checkout = async (req, res) => {
  try {
    const { user } = req;
    const { productId } = req.body;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Please login or register to proceed with checkout." });
    }

    if (!productId) {
      return res
        .status(400)
        .json({
          message: "Please provide a product ID for checkout.",
          status: false,
        });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({
          message: "No product found for the provided ID.",
          status: false,
        });
    }

    const totalAmount = product.price;

    const userCart = await UserCart.findOne({ userId: user.id });

    if (userCart) {
      userCart.products.push(product._id);
      await userCart.save();
    } else {
      const newCart = new UserCart({
        userId: user.id,
        products: [product._id],
      });
      await newCart.save();
    }

    res.status(200).json({
      message: "Checkout successful and product added to cart.",
      user: { id: user.id, email: user.email },
      cartItems: [product],
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserCartProducts = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Please provide a user ID.", status: false });
    }

    const userCart = await UserCart.findOne({ userId }).populate('products');

    if (!userCart || userCart.products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in the user's cart.", status: false });
    }

    res.status(200).json({
      message: "User's cart products fetched successfully.",
      products: userCart.products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { user } = req;
    const { productId } = req.body;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Please login or register to proceed." });
    }

    if (!productId) {
      return res
        .status(400)
        .json({
          message: "Please provide a product ID to remove.",
          status: false,
        });
    }

    const userCart = await UserCart.findOne({ userId: user.id });

    if (!userCart) {
      return res
        .status(404)
        .json({
          message: "No cart found for the user.",
          status: false,
        });
    }

    const productIndex = userCart.products.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({
          message: "Product not found in the cart.",
          status: false,
        });
    }

    // Remove the product from the cart
    userCart.products.splice(productIndex, 1);
    await userCart.save();

    res.status(200).json({
      message: "Product removed from cart successfully.",
      cartItems: userCart.products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
