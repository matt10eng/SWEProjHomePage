const express = require('express');
const router = express.Router();
const { getCurrentUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// GET /api/users/me - Get current user's profile
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router; 