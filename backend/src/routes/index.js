const express = require('express');
const healthRoutes = require('./health.routes');

const apiRouter = express.Router();

// Mount sub-routes
apiRouter.use('/health', healthRoutes);

module.exports = apiRouter;
