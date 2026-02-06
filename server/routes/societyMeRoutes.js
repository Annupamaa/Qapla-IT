const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/societyMeController");

router.use(auth);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

module.exports = router;
