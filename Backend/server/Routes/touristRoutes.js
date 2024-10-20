const express = require("express");
const {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
} = require("../Controllers/touristController");
const router = express.Router();

router.get("/getTourist", getTourist);
router.put("/createTourist/:userId", createTourist);
router.put("/updateTourist/:touristId", updateTourist);
router.get("/viewAll", viewAll);
module.exports = router;
