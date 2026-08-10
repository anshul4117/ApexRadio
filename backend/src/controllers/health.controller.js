const healthService = require('../services/health.service');
const { sendSuccess } = require('../utils/response.util');

const checkHealth = (req, res, next) => {
  try {
    const healthData = healthService.getSystemHealth();
    return sendSuccess(res, 200, healthData, 'ApexRadio AI backend service is running smoothly');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkHealth,
};
