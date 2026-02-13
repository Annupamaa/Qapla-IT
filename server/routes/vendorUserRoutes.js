const express = require('express');
const router = express.Router();
const vendorUserController = require('../controllers/vendorUserController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, vendorUserController.getMyProfile);


router.get('/', vendorUserController.getAllVendorUsers);
router.get('/:id', vendorUserController.getVendorUserById);
router.post('/', vendorUserController.createVendorUser);
router.put('/:id', vendorUserController.updateVendorUser);
router.delete('/:id', vendorUserController.deleteVendorUser);

module.exports = router;




