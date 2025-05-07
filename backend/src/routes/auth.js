const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');

// Registration endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

// Refresh access token using refresh cookie
router.post('/refresh', refreshToken);

// Logout user and clear refresh token cookie
router.post('/logout', logout);

module.exports = router;
