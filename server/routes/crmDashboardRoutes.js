const express = require('express');
const router = express.Router();

const crmDashboardController = require('../controllers/crmDashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

// CRM Vendor Dashboard
router.get(
    '/vendor',
    authMiddleware,
    allowRoles("CRM_VENDOR"),
    crmDashboardController.vendorDashboard
);

// CRM Society Dashboard
router.get(
    '/society',
    authMiddleware,
    allowRoles("CRM_SOCIETY"),
    crmDashboardController.societyDetails
);

module.exports = router;
