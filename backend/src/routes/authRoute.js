// Route for handling user authentication (sign-up, log-in, password reset)
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.put('/reset-password', authController.resetPassword);

module.exports = router;