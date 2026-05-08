const express = require("express");
const router = express.Router();

const VendorResponseController = require("../controllers/vendorResponseController");
const authMiddleware = require("../middleware/authMiddleware");

/*
  Route to mark quotation as sent by vendor
  Accessible only for authenticated users
*/
router.post(
    "/send-quotation",  

    // Verify user authentication using JWT token
    authMiddleware,

    // Controller to handle quotation submission
    VendorResponseController.markQuotationSent
);
module.exports = router;