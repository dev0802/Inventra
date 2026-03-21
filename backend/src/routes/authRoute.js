const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/reset-password', authController.resetPassword);

module.exports = router;