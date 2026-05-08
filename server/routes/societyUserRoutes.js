const express = require('express');
const router = express.Router();
const societyUserController = require('../controllers/societyUserController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/allowRoles');

/*
  Route to fetch all society users
  Accessible by ADMIN, CRM_SOCIETY, and SOCIETY_USER roles
*/
router.get(
    '/',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),

    // Controller to fetch all society users
    societyUserController.getAllSocietyUsers
);

/*
  Route to fetch society user details by ID
  Accessible by ADMIN, CRM_SOCIETY, and SOCIETY_USER roles
*/
router.get(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),

    // Controller to fetch society user by ID
    societyUserController.getSocietyUserById
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

    // Controller to fetch profile
    societyUserController.getMyProfile
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

    // Controller to update profile
    societyUserController.updateMyProfile
);

/*
  Route to create a new society user
  Accessible by ADMIN and CRM_SOCIETY roles
*/
router.post(
    '/',

    // Verify user authentication
    authMiddleware,

    // Allow only ADMIN and CRM_SOCIETY roles
    allowRoles("ADMIN", "CRM_SOCIETY"),

    // Controller to create society user
    societyUserController.createSocietyUser
);

/*
  Route to update society user details by ID
  Accessible by ADMIN, CRM_SOCIETY, and SOCIETY_USER roles
*/
router.put(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only specific roles
    allowRoles("ADMIN", "CRM_SOCIETY", "SOCIETY_USER"),

    // Controller to update society user
    societyUserController.updateSocietyUser
);

/*
  Route to delete society user by ID
  Accessible only by ADMIN role
*/
router.delete(
    '/:id',

    // Verify user authentication
    authMiddleware,

    // Allow only ADMIN role
    allowRoles("ADMIN"),

    // Controller to delete society user
    societyUserController.deleteSocietyUser
);

module.exports = router;




