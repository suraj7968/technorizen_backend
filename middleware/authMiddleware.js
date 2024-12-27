const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    
    // Check if the Authorization header is present
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header missing. Please log in." });
    }

    // Extract the token from the 'Bearer <token>' format
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token missing. Please log in." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user to the request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
