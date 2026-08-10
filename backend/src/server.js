const app = require('./app');
const envConfig = require('./config/env.config');
const logger = require('./utils/logger.util');

const server = app.listen(envConfig.port, () => {
  logger.info(`🏎️  ApexRadio AI Backend Server listening on port ${envConfig.port}`);
  logger.info(`📊 Health check available at: http://localhost:${envConfig.port}/api/health`);
  logger.info(`⚙️  Environment: ${envConfig.nodeEnv}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed cleanly');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed cleanly');
  });
});
