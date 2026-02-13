const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

router.get(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR"),
    vendorController.getAllVendors
);

router.get(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),
    vendorController.getVendorById
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




