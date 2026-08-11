const express = require('express');
const cors = require('cors');
const envConfig = require('./config/env.config');
const apiRoutes = require('./routes');
const { requestLogger } = require('./middleware/logger.middleware');
const rateLimiter = require('./middleware/rateLimit.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Production-Safe CORS Options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, Postman)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (envConfig.allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // In development mode, allow localhost origins
    if (!envConfig.isProduction) {
      return callback(null, true);
    }

    return callback(new Error(`CORS error: Origin ${origin} not in allowed list`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204,
};

// Enable CORS for all routes and handle preflight OPTIONS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Mount rate limiter on API routes
app.use('/api', rateLimiter, apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    service: 'ApexRadio AI Backend API',
    status: 'online',
    health: '/api/health',
    version: '1.0.0',
    allowedOrigins: envConfig.allowedOrigins,
    huggingFaceIntegration: envConfig.hfApiKey ? 'API Key Configured' : 'Domain Acoustic Engine (Active)',
  });
});

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
