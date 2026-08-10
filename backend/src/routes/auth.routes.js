const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Public auth routes
router.post('/register', register);
router.post('/login', login);

// Protected auth route
router.get('/me', authenticate, getMe);

module.exports = router;
