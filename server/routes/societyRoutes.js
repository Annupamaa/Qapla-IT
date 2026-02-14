const express = require('express');
const router = express.Router();
const societyController = require('../controllers/societyController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

router.get(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY"),
    societyController.getAllSocieties
);

router.get(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),
    societyController.getSocietyById
);

router.get(
    "/profile",
    authMiddleware,
    allowRoles("VENDOR_USER"),
    societyController.getMySociety
);

router.put(
    "/profile",
    authMiddleware,
    allowRoles("VENDOR_USER"),
    societyController.updateMySociety
);

router.post(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY"),
    societyController.createSociety
);

router.put(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),
    societyController.updateSociety
);

router.delete(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY"),
    societyController.deleteSociety
);

module.exports = router;
