const express = require('express');
const router = express.Router();

const vendorController = require('../controllers/vendorController');
const VendorWorkOrderController = require("../controllers/VendorWorkOrderController");
const VendorQuotationController = require("../controllers/VendorQuotationController");

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');


// =========================
// VENDOR CRUD
// =========================

router.get(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),
    vendorController.getAllVendors
);

router.get(
    "/profile",
    authMiddleware,
    allowRoles("VENDOR_USER"),
    vendorController.getMyVendor
);

router.put(
    "/profile",
    authMiddleware,
    allowRoles("VENDOR_USER"),
    vendorController.updateMyVendor
);

router.post(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR"),
    vendorController.createVendor
);

// =========================
// WORK ORDERS (NEW)
// =========================

router.post(
    "/mark-completed",
    authMiddleware,
    allowRoles("VENDOR_USER"),
    VendorWorkOrderController.markCompleted
);

router.get(
    "/quotations",
    authMiddleware,
    allowRoles("VENDOR_USER", "CRM_VENDOR"),
    VendorQuotationController.getMyQuotations
);

router.get(
    "/work-orders",
    authMiddleware,
    allowRoles("VENDOR_USER", "CRM_VENDOR"),
    VendorWorkOrderController.getWorkOrders
);

router.get(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),
    vendorController.getVendorById
);

router.put(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),
    vendorController.updateVendor
);

router.delete(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN"),
    vendorController.deleteVendor
);

module.exports = router;