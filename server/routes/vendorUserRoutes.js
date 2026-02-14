const express = require('express');
const router = express.Router();
const vendorUserController = require('../controllers/vendorUserController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, vendorUserController.getMyProfile);


const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

router.get(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),
    vendorUserController.getAllVendorUsers
);

router.get(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),
    vendorUserController.getVendorUserById
);

router.get(
    "/profile",
    authMiddleware,
    allowRoles("VENDOR_USER"),
    vendorUserController.getMyProfile
);

router.post(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR"),
    vendorUserController.createVendorUser
);

router.put(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),
    vendorUserController.updateVendorUser
);

router.put(
    "/profile",
    authMiddleware,
    allowRoles("VENDOR_USER"),
    vendorUserController.updateMyProfile
);

router.delete(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN"),
    vendorUserController.deleteVendorUser
);

module.exports = router;