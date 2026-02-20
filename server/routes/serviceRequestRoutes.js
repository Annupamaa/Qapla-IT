const express = require("express");
const router = express.Router();

const ServiceRequestController = require("../controllers/serviceRequestController");

// If you have auth middleware
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// CREATE
// ===============================
router.post(
    "/",
    authMiddleware,   // remove if not using auth yet
    ServiceRequestController.createRequest
);

// ===============================
// UPDATE
// ===============================
router.put(
    "/:id",
    authMiddleware,
    ServiceRequestController.updateRequest
);

// ===============================
// GET ALL
// ===============================
router.get(
    "/",
    authMiddleware,
    ServiceRequestController.getAllRequests
);

// ===============================
// GET SINGLE
// ===============================
router.get(
    "/:id",
    authMiddleware,
    ServiceRequestController.getRequestById
);

// ===============================
// GET HISTORY
// ===============================
router.get(
    "/:id/history",
    authMiddleware,
    ServiceRequestController.getRequestHistory
);

module.exports = router;
