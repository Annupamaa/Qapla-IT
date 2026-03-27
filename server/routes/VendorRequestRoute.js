const express = require("express");
const router = express.Router();

const VendorResponseController = require("../controllers/vendorResponseController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/send-quotation",  
    authMiddleware,
    VendorResponseController.markQuotationSent
);

module.exports = router;