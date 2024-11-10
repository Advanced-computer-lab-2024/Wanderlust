const express = require('express');
const transportationController = require('../Controllers/transportationController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// POST /transportation/book - Book a transportation
router.post('/book', authenticate, transportationController.book);

module.exports = router;
