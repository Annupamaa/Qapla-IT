require("dotenv").config();
const jwt = require("jsonwebtoken");

/*
  Middleware to authenticate JWT token
*/
module.exports = (req, res, next) => {

  // Get authorization header from request
  const authHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authHeader) {

    return res.status(401).json({
      message: "No token provided"
    });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {

    // Verify token using JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded user data in request object
    req.user = decoded;

    // Continue to next middleware or route handler
    next();

  } catch (err) {

    // Handle invalid or expired token
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};