const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const radioRoutes = require('./radio.routes');

const apiRouter = express.Router();

// Mount sub-routes
apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/radio', radioRoutes);

module.exports = apiRouter;
