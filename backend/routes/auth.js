const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authControllers.registerUser);
router.post('/login', authControllers.loginUser);

// Protected routes
router.get('/me', auth, authControllers.getMe);
router.post('/logout', auth, authControllers.logout);

module.exports = router;
