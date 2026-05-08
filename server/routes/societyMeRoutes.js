const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/societyMeController");

/*
  Apply authentication middleware to all routes
  below this line
*/
router.use(auth);

/*
  Route to fetch logged-in society user's profile
*/
router.get("/me", getMyProfile);

/*
  Route to update logged-in society user's profile
*/
router.put("/me", updateMyProfile);

module.exports = router;
