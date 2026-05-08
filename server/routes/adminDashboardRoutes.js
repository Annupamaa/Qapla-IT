const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/adminDashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");

/*
  Route to fetch admin dashboard data
  Accessible only by authenticated ADMIN users
*/
router.get(
    "/dashboard",

    // Verify JWT token and authenticate user
    authMiddleware,

    // Allow only ADMIN role
    allowRoles("ADMIN"),

    // Controller to handle dashboard request
    adminDashboardController.getAdminDashboard
);

module.exports = router;