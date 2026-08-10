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
    cb(null, `radio-${uniqueSuffix}${ext}`);
  },
});

// File filter: only accept WAV and MP3 audio
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.wav', '.mp3', '.flac', '.ogg'];
  const allowedMimeTypes = [
    'audio/wav',
    'audio/x-wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/x-m4a',
    'application/octet-stream',
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid audio format. Only WAV, MP3, and FLAC audio files are supported.'), false);
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
