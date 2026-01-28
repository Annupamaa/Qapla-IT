const express = require('express');
const router = express.Router();
const societyUserController = require('../controllers/societyUserController');

router.get('/', societyUserController.getAllSocietyUsers);
router.get('/:id', societyUserController.getSocietyUserById);
router.post('/', societyUserController.createSocietyUser);
router.put('/:id', societyUserController.updateSocietyUser);
router.delete('/:id', societyUserController.deleteSocietyUser);

module.exports = router;




