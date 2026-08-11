const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const radioRoutes = require('./radio.routes');
const lapsRoutes = require('./laps.routes');
const sessionRoutes = require('./session.routes');

const apiRouter = express.Router();

// Mount sub-routes
apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/radio', radioRoutes);
apiRouter.use('/laps', lapsRoutes);
apiRouter.use('/session', sessionRoutes);

module.exports = apiRouter;
