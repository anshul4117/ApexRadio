const express = require('express');
const { getCurrentSession, resetSession } = require('../controllers/session.controller');

const router = express.Router();

// GET /api/session/current - Get unified race session state
router.get('/current', getCurrentSession);

// POST /api/session/reset - Reset race session
router.post('/reset', resetSession);

module.exports = router;
