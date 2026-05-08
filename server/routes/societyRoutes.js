const express = require('express');
const router = express.Router();
const societyController = require('../controllers/societyController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

/*
  Route to fetch all societies
  Accessible by ADMIN, CRM_SOCIETY, and SOCIETY_USER roles
*/
router.get(
    '/',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),

    // Controller to fetch all societies
    societyController.getAllSocieties
);

/*
  Route to fetch society details by ID
  Accessible by ADMIN, CRM_SOCIETY, and SOCIETY_USER roles
*/
router.get(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),

    // Controller to fetch society by ID
    societyController.getSocietyById
);

/*
  Route to fetch logged-in society user's profile
  Accessible only by SOCIETY_USER role
*/
router.get(
    "/profile",

    // Verify user authentication
    authMiddleware,

    // Allow only SOCIETY_USER role
    allowRoles("SOCIETY_USER"),

    // Controller to fetch society profile
    societyController.getMySociety
);

/*
  Route to update logged-in society user's profile
  Accessible only by SOCIETY_USER role
*/
router.put(
    "/profile",

    // Verify user authentication
    authMiddleware,

    // Allow only SOCIETY_USER role
    allowRoles("SOCIETY_USER"),

    // Controller to update society profile
    societyController.updateMySociety
);

/*
  Route to create a new society
  Accessible by ADMIN and CRM_SOCIETY roles
*/
router.post(
    '/',

    // Verify user authentication
    authMiddleware,

    // Allow only ADMIN and CRM_SOCIETY roles
    allowRoles("ADMIN", "CRM_SOCIETY"),

    // Controller to create society
    societyController.createSociety
);

/*
  Route to update society details by ID
  Accessible by ADMIN, CRM_SOCIETY, and SOCIETY_USER roles
*/
router.put(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),

    // Controller to update society
    societyController.updateSociety
);

/*
  Route to delete society by ID
  Accessible by ADMIN and CRM_SOCIETY roles
*/
router.delete(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only ADMIN and CRM_SOCIETY roles
    allowRoles("ADMIN", "CRM_SOCIETY"),

    // Controller to delete society
    societyController.deleteSociety
);

module.exports = router;
