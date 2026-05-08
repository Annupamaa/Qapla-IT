// Middleware function to allow access based on specific role
module.exports = (role) => (req, res, next) => {

  // Check if logged-in user's role matches required role
  if (req.user.role !== role) {

    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  // Continue to next middleware or route handler
  next();
};