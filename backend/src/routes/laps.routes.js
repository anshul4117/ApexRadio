const express = require('express');
const upload = require('../middleware/upload.middleware');
const { uploadCsv, analyzeLaps, getSession } = require('../controllers/laps.controller');

const router = express.Router();

// Upload and analyze CSV file
router.post('/upload', upload.single('csv'), uploadCsv);

// Direct analysis endpoint
router.post('/analyze', upload.single('csv'), analyzeLaps);

// Get current session lap data & correlation
router.get('/session', getSession);

module.exports = router;
