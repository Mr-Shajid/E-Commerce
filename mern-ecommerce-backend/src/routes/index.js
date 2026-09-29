const express = require('express');
const healthRoutes = require('./health.routes');
const authRoute = require('./auth.routes');

const router = express.Router();

router.use(healthRoutes);
router.use(authRoute);

module.exports = router;