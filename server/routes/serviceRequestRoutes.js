const express = require("express");
const router = express.Router();

const ServiceRequestController = require("../controllers/serviceRequestController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");

// ===============================
// CREATE
// ===============================
router.post(
  "/",
  authMiddleware,
  ServiceRequestController.createRequest,
);

router.post(
  "/create-resolution",
  authMiddleware,
  ServiceRequestController.createResolution
);

router.post(
  "/issue-work-order",
  authMiddleware,
  ServiceRequestController.issueWorkOrder
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

router.put(
  "/:id/approve",
  authMiddleware,
  allowRoles("SOCIETY_USER"),
  ServiceRequestController.approveRequest
);

router.put(
  "/:id/cancel",
  authMiddleware,
  allowRoles("SOCIETY_USER"),
  ServiceRequestController.cancelRequest
);

router.put(
  "/:id/publish",
  authMiddleware,
  allowRoles("SOCIETY_USER"),
  ServiceRequestController.publishRequest
);

// ===============================
// GET PUBLISHED (for vendors)
// ===============================
router.get(
  "/published",
  authMiddleware,
  ServiceRequestController.getPublishedRequests
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

router.put(
  "/:id/invoice-received",
  authMiddleware,
  ServiceRequestController.markInvoiceReceived
);

router.put(
  "/:id/payment-done",
  authMiddleware,
  ServiceRequestController.markPaymentDone
);

router.put(
  "/:id/receipt-received",
  authMiddleware,
  ServiceRequestController.markReceiptReceived
);

router.put(
  "/:id/close",
  authMiddleware,
  ServiceRequestController.closeRequest
);

router.put(
  "/:id/send-invoice",
  authMiddleware,
  allowRoles("VENDOR_USER"),
  ServiceRequestController.sendInvoice
);

module.exports = router;
