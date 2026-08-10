const jwt = require('jsonwebtoken');
const envConfig = require('../config/env.config');
const { sendError } = require('../utils/response.util');

/**
 * Authentication Middleware
 * Verifies JWT bearer token from Authorization header
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Authentication token required', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 401, 'Invalid authorization format', 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(token, envConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Authentication token expired', 'TOKEN_EXPIRED');
    }
    return sendError(res, 401, 'Invalid authentication token', 'INVALID_TOKEN');
  }
};

module.exports = {
  authenticate,
};
