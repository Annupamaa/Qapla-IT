const express = require("express");
const router = express.Router();

const ServiceRequestController = require("../controllers/serviceRequestController");

const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// CREATE
// ===============================
router.post(
  "/",
  authMiddleware,
  ServiceRequestController.createRequest,
);

// ===============================
// UPDATE
// ===============================
router.put("/:id", authMiddleware, ServiceRequestController.updateRequest);

router.get(
  "/society",
  authMiddleware,
  ServiceRequestController.getRequestsBySociety,
);

// ===============================
// MY REQUESTS
// ===============================
router.get("/my", authMiddleware, ServiceRequestController.getMyRequests);

// ===============================
// GET ALL
// ===============================
router.get("/", authMiddleware, ServiceRequestController.getAllRequests);

// ===============================
// GET SINGLE
// ===============================
router.get("/:id", authMiddleware, ServiceRequestController.getRequestById);

// ===============================
// GET HISTORY
// ===============================
router.get(
  "/:id/history",
  authMiddleware,
  ServiceRequestController.getRequestHistory,
);

module.exports = router;
