const express = require('express');
const router = express.Router();
const societyUserController = require('../controllers/societyUserController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

router.get(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),
    societyUserController.getAllSocietyUsers
);

router.get(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),
    societyUserController.getSocietyUserById
);

router.post(
    '/',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY"),
    societyUserController.createSocietyUser
);

router.put(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),
    societyUserController.updateSocietyUser
);

router.delete(
    '/:id',
    authMiddleware,
    allowRoles("ADMIN"),
    societyUserController.deleteSocietyUser
);

module.exports = router;




