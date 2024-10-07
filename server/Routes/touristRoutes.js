const express = require("express");
const {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
} = require("../Controllers/touristController");
const router = express.Router();

router.get("/getTourist", getTourist);
router.post("/createTourist", createTourist);
router.put("/updateTourist/:touristId", updateTourist);
router.get("/viewAll", viewAll);
module.exports = router;
