const multer = require('multer');
const path = require('path');
const fs = require('fs');
const envConfig = require('../config/env.config');

// Ensure upload directory exists
if (!fs.existsSync(envConfig.uploadDir)) {
  fs.mkdirSync(envConfig.uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, envConfig.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const prefix = file.fieldname === 'csv' ? 'telemetry' : 'radio';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

// File filter: accept WAV/MP3/WEBM audio and CSV telemetry files
const fileFilter = (req, file, cb) => {
  const allowedAudioExts = ['.wav', '.mp3', '.flac', '.ogg', '.m4a', '.webm', '.mp4'];
  const allowedCsvExts = ['.csv', '.txt'];
  const allowedMimeTypes = [
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/x-m4a',
    'audio/webm',
    'audio/webm;codecs=opus',
    'audio/mp4',
    'text/csv',
    'text/plain',
    'application/csv',
    'application/vnd.ms-excel',
    'application/octet-stream',
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedAudioExts.includes(ext) ||
    allowedCsvExts.includes(ext) ||
    allowedMimeTypes.includes(file.mimetype) ||
    file.mimetype?.startsWith('audio/')
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file format (${ext || file.mimetype}). Supported formats: Audio (.wav, .mp3, .webm) and Telemetry (.csv).`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
});

module.exports = upload;
