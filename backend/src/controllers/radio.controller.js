const fs = require('fs');
const radioAnalysisService = require('../services/radioAnalysisService');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * POST /api/radio/upload
 * Handles audio upload via Multer and returns file metadata
 */
const uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Audio file required (.wav or .mp3)', 'NO_FILE_UPLOADED');
    }

    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
    };

    return sendSuccess(res, 200, fileInfo, 'Audio uploaded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/radio/analyze
 * Analyzes an audio file or sample preset through the STT + Emotion pipeline
 */
const analyzeAudio = async (req, res, next) => {
  const file = req.file || null;
  try {
    const body = req.body || {};
    const analysisResult = await radioAnalysisService.analyzeAudio(file, body);

    return sendSuccess(res, 200, analysisResult, 'Radio analysis completed');
  } catch (error) {
    next(error);
  } finally {
    // Guaranteed temporary file cleanup
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        // ignore
      }
    }
  }
};

/**
 * GET /api/radio/history
 * Returns the recorded radio analysis history
 */
const getHistory = async (req, res, next) => {
  try {
    const history = radioAnalysisService.getHistory();
    return sendSuccess(res, 200, { history }, 'Radio analysis history retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAudio,
  analyzeAudio,
  getHistory,
};
