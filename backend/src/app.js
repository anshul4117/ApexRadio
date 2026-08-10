const express = require('express');
const cors = require('cors');
const envConfig = require('./config/env.config');
const apiRoutes = require('./routes');
const { requestLogger } = require('./middleware/logger.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security & Parsing Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Base Route
app.use('/api', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    service: 'ApexRadio AI Backend API',
    status: 'online',
    docs: '/api/health',
    version: '1.0.0',
  });
});

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
