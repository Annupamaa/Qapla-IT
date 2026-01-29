const express = require("express");
const router = express.Router();
const { login, changePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Login
router.post("/login", login);

// Change password
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
