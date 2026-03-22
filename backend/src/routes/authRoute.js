const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/check-phone', authController.checkPhoneNumber);
router.post('/check-password', authController.checkPassword);
router.put('/reset-password', authController.resetPassword);

module.exports = router;