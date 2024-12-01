const express = require('express');
const { getGuide } = require('../Controllers/guideController');
const router = express.Router();

// Route to fetch the vacation guide
router.get('/guide', getGuide);

module.exports = router;
