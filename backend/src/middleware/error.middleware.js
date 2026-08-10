const { sendError } = require('../utils/response.util');
const logger = require('../utils/logger.util');

/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  return sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`, 'NOT_FOUND');
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return sendError(res, statusCode, message, code, details);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
