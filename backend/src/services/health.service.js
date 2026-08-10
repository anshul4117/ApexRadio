const envConfig = require('../config/env.config');

const getSystemHealth = () => {
  return {
    service: 'apexradio-ai-backend',
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: envConfig.nodeEnv,
    version: '1.0.0',
    memoryUsage: {
      rssMb: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      heapUsedMb: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
    },
  };
};

module.exports = {
  getSystemHealth,
};
