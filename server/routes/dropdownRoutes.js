const express = require("express");
const router = express.Router();

const DropdownController = require("../controllers/dropdownController");
const authMiddleware = require("../middlewares/authMiddleware");

// Example:
// GET /api/dropdowns/statuses
router.get(
    "/:type",
    authMiddleware,
    DropdownController.getDropdown
);

module.exports = router;
