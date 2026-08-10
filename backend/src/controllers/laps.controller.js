const fs = require('fs');
const path = require('path');
const lapAnalysisService = require('../services/lapAnalysisService');
const correlationService = require('../services/correlationService');
const radioAnalysisService = require('../services/radioAnalysisService');
const { sendSuccess, sendError } = require('../utils/response.util');

// In-memory session state for lap telemetry
let currentLapSession = null;

// Initialize with default sample dataset
const initDefaultSession = () => {
  try {
    const sampleCsvPath = path.join(__dirname, '../../../sample-data/silverstone_stint1_telemetry.csv');
    if (fs.existsSync(sampleCsvPath)) {
      const content = fs.readFileSync(sampleCsvPath, 'utf-8');
      const laps = lapAnalysisService.parseCsv(content);
      const lapStats = lapAnalysisService.analyzeLaps(laps);
      const latestRadio = radioAnalysisService.getHistory()[0] || {};
      const radioHistory = radioAnalysisService.getHistory();
      const correlation = correlationService.correlate(lapStats, latestRadio, radioHistory);

      currentLapSession = {
        id: 'session_stint1',
        filename: 'silverstone_stint1_telemetry.csv',
        lapStats,
        correlation,
        updatedAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Could not load initial default lap session:', err.message);
  }
};

initDefaultSession();

/**
 * POST /api/laps/upload
 */
const uploadCsv = async (req, res, next) => {
  const filePath = req.file?.path || null;
  try {
    if (!req.file) {
      return sendError(res, 400, 'CSV file required (.csv)', 'NO_FILE_UPLOADED');
    }

    const content = fs.readFileSync(req.file.path, 'utf-8');
    const laps = lapAnalysisService.parseCsv(content);
    const lapStats = lapAnalysisService.analyzeLaps(laps);

    const latestRadio = radioAnalysisService.getHistory()[0] || {};
    const radioHistory = radioAnalysisService.getHistory();
    const correlation = correlationService.correlate(lapStats, latestRadio, radioHistory);

    currentLapSession = {
      id: `session_${Date.now()}`,
      filename: req.file.originalname,
      lapStats,
      correlation,
      updatedAt: new Date().toISOString(),
    };

    return sendSuccess(res, 200, currentLapSession, 'CSV telemetry parsed and analyzed');
  } catch (error) {
    next(error);
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // ignore
      }
    }
  }
};

/**
 * POST /api/laps/analyze
 */
const analyzeLaps = async (req, res, next) => {
  const filePath = req.file?.path || null;
  try {
    let content = req.body.csvContent;

    if (!content && req.file) {
      content = fs.readFileSync(req.file.path, 'utf-8');
    }

    if (!content) {
      // If no CSV provided, load sample dataset
      const sampleCsvPath = path.join(__dirname, '../../../sample-data/silverstone_stint1_telemetry.csv');
      content = fs.readFileSync(sampleCsvPath, 'utf-8');
    }

    const laps = lapAnalysisService.parseCsv(content);
    const lapStats = lapAnalysisService.analyzeLaps(laps);

    const latestRadio = radioAnalysisService.getHistory()[0] || {};
    const radioHistory = radioAnalysisService.getHistory();
    const correlation = correlationService.correlate(lapStats, latestRadio, radioHistory);

    currentLapSession = {
      id: `session_${Date.now()}`,
      filename: req.body.filename || req.file?.originalname || 'silverstone_stint1_telemetry.csv',
      lapStats,
      correlation,
      updatedAt: new Date().toISOString(),
    };

    return sendSuccess(res, 200, currentLapSession, 'Lap telemetry correlation completed');
  } catch (error) {
    next(error);
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // ignore
      }
    }
  }
};

/**
 * GET /api/laps/session
 */
const getSession = async (req, res, next) => {
  try {
    if (!currentLapSession) {
      initDefaultSession();
    }
    return sendSuccess(res, 200, currentLapSession, 'Current lap session retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCsv,
  analyzeLaps,
  getSession,
};
