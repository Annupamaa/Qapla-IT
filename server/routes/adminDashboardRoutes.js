const express = require("express");
const router = express.Router();

const adminDashboardController = require("../controllers/adminDashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");

router.get(
    "/dashboard",
    authMiddleware,
    allowRoles("ADMIN"),
    adminDashboardController.getAdminDashboard
);

module.exports = router;
