const sessionService = require('../services/sessionService');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * GET /api/session/current
 * Returns the combined active race session containing:
 * - driverName
 * - currentLap & totalLaps
 * - transcript
 * - driverState & stressScore
 * - lapData & lapStats
 * - correlation & AI recommendation
 * - sessionTimestamp
 */
const getCurrentSession = async (req, res, next) => {
  try {
    const session = sessionService.getSession();
    return sendSuccess(res, 200, session, 'Active race session retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/session/reset
 * Resets race session to default nominal state
 */
const resetSession = async (req, res, next) => {
  try {
    const session = sessionService.resetSession();
    return sendSuccess(res, 200, session, 'Race session reset successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentSession,
  resetSession,
};
