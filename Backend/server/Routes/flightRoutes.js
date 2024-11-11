// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const { getFlightData } = require('../Controllers/flightController');

router.get('/flights', getFlightData);

module.exports = router;
