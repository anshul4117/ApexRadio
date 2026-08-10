const express = require('express');
const upload = require('../middleware/upload.middleware');
const { uploadAudio, analyzeAudio, getHistory } = require('../controllers/radio.controller');

const router = express.Router();

// Audio upload endpoint
router.post('/upload', upload.single('audio'), uploadAudio);

// Audio analysis endpoint (accepts multipart file or json body with sampleHint)
router.post('/analyze', upload.single('audio'), analyzeAudio);

// Session history endpoint
router.get('/history', getHistory);

module.exports = router;
