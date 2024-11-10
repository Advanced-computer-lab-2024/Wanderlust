const express = require("express");
const {
    bookTransportation
  } = require("../Controllers/transportationController");
  const router = express.Router();

// POST /transportation/book - Book a transportation
router.post('/bookTransportation', bookTransportation);

module.exports = router;
