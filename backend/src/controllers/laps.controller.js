const fs = require('fs');
const path = require('path');
const lapAnalysisService = require('../services/lapAnalysisService');
const correlationService = require('../services/correlationService');
const radioAnalysisService = require('../services/radioAnalysisService');
const sessionService = require('../services/sessionService');
const { sendSuccess, sendError } = require('../utils/response.util');

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

      sessionService.updateLapData({
        laps,
        lapStats,
        correlation,
        filename: 'silverstone_stint1_telemetry.csv',
        driverName: 'Max Verstappen',
      });
    }
  } catch (err) {
    console.warn('Could not load initial default lap session:', err.message);
  }
};

initDefaultSession();

/**
 * POST /api/laps/upload
 * Accepts CSV with columns: lap,lap_time (or full telemetry)
 * Validates and updates unified race session
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

    const session = sessionService.updateLapData({
      laps,
      lapStats,
      correlation,
      filename: req.file.originalname,
      driverName: req.body?.driverName,
    });

    return sendSuccess(
      res,
      200,
      {
        lapStats,
        correlation,
        session,
        lapsLoaded: laps.length,
        currentLap: laps[laps.length - 1].lap,
        filename: req.file.originalname,
      },
      'CSV telemetry parsed and session synchronized'
    );
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
      const sampleCsvPath = path.join(__dirname, '../../../sample-data/silverstone_stint1_telemetry.csv');
      content = fs.readFileSync(sampleCsvPath, 'utf-8');
    }

    const laps = lapAnalysisService.parseCsv(content);
    const lapStats = lapAnalysisService.analyzeLaps(laps);

    const latestRadio = radioAnalysisService.getHistory()[0] || {};
    const radioHistory = radioAnalysisService.getHistory();
    const correlation = correlationService.correlate(lapStats, latestRadio, radioHistory);

    const session = sessionService.updateLapData({
      laps,
      lapStats,
      correlation,
      filename: req.body.filename || req.file?.originalname || 'silverstone_stint1_telemetry.csv',
    });

    return sendSuccess(
      res,
      200,
      {
        lapStats,
        correlation,
        session,
        lapsLoaded: laps.length,
        currentLap: laps[laps.length - 1].lap,
      },
      'Lap telemetry correlation completed'
    );
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
    const session = sessionService.getSession();
    return sendSuccess(
      res,
      200,
      {
        id: session.sessionId,
        filename: session.lapFilename || 'silverstone_stint1_telemetry.csv',
        lapStats: session.lapStats,
        correlation: session.correlation,
        session,
        updatedAt: session.updatedAt,
      },
      'Current lap session retrieved'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCsv,
  analyzeLaps,
  getSession,
};
