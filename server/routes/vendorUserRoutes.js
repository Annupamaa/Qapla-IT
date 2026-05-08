const express = require('express');
const router = express.Router();
const vendorUserController = require('../controllers/vendorUserController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

/*
  Route to fetch logged-in vendor user's profile
  Accessible for authenticated users
*/
router.get(

    '/me',

    // Verify user authentication
    authMiddleware,

    // Controller to fetch logged-in vendor profile
    vendorUserController.getMyProfile
);

/*
  Route to fetch all vendor users
  Accessible by ADMIN, CRM_VENDOR, and VENDOR_USER roles
*/
router.get(
    '/',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),

    // Controller to fetch all vendor users
    vendorUserController.getAllVendorUsers
);

/*
  Route to fetch vendor user details by ID
  Accessible by ADMIN, CRM_VENDOR, and VENDOR_USER roles
*/
router.get(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),

    // Controller to fetch vendor user by ID
    vendorUserController.getVendorUserById
);

/*
  Route to fetch logged-in vendor user's profile
  Accessible only by VENDOR_USER role
*/
router.get(
    "/profile",

    // Verify user authentication
    authMiddleware,

    // Allow only VENDOR_USER role
    allowRoles("VENDOR_USER"),

    // Controller to fetch profile
    vendorUserController.getMyProfile
);

/*
  Route to create a new vendor user
  Accessible by ADMIN and CRM_VENDOR roles
*/
router.post(
    '/',

    // Verify user authentication
    authMiddleware,

    // Allow only ADMIN and CRM_VENDOR roles
    allowRoles("ADMIN", "CRM_VENDOR"),

    // Controller to create vendor user
    vendorUserController.createVendorUser
);

/*
  Route to update vendor user details by ID
  Accessible by ADMIN, CRM_VENDOR, and VENDOR_USER roles
*/
router.put(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_VENDOR", "VENDOR_USER"),

    // Controller to update vendor user
    vendorUserController.updateVendorUser
);

/*
  Route to update logged-in vendor user's profile
  Accessible only by VENDOR_USER role
*/
router.put(
    "/profile",

    // Verify user authentication
    authMiddleware,

    // Allow only VENDOR_USER role
    allowRoles("VENDOR_USER"),

    // Controller to update profile
    vendorUserController.updateMyProfile
);

/*
  Route to delete vendor user by ID
  Accessible only by ADMIN role
*/
router.delete(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only ADMIN role
    allowRoles("ADMIN"),

    // Controller to delete vendor user
    vendorUserController.deleteVendorUser
);

module.exports = router;