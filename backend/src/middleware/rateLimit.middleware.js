const { sendError } = require('../utils/response.util');

// Simple in-memory rate limiter suitable for hackathon and demo environments
const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests per minute

// Cleanup expired IP records every 2 minutes with unref to avoid blocking process exit
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.startTime > WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
}, 2 * WINDOW_MS);

if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Lightweight Demo-Tuned Rate Limiter Middleware
 */
const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  let clientData = requestCounts.get(ip);

  if (!clientData || now - clientData.startTime > WINDOW_MS) {
    clientData = {
      startTime: now,
      count: 1,
    };
    requestCounts.set(ip, clientData);
    return next();
  }

  clientData.count += 1;

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    res.setHeader('Retry-After', Math.ceil((WINDOW_MS - (now - clientData.startTime)) / 1000));
    return sendError(
      res,
      429,
      'Rate limit exceeded. Please slow down request frequency.',
      'RATE_LIMIT_EXCEEDED'
    );
  }

  next();
};

module.exports = rateLimiter;
