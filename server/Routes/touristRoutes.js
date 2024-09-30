const express = require("express");
const {
  getTourist,
  createTourist,
  updateTourist,
} = require("../Controllers/touristController");
const router = express.Router();

router.get("/getTourist", getTourist);
router.post("/createTourist", createTourist);
router.put("/updateTourist/:touristId", updateTourist);
module.exports = router;
