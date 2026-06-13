// Route for handling user authentication (sign-up, log-in, password reset)
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.put('/reset-password', authController.resetPassword);

router.post('/logout', authController.logOut);
router.get('/verify-session', verifyToken, authController.verifySession);

module.exports = router;