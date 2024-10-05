const express = require("express");
const {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
  searchAll,
} = require("../Controllers/touristController");
const router = express.Router();

router.get("/getTourist", getTourist);
router.post("/createTourist", createTourist);
router.put("/updateTourist/:touristId", updateTourist);
router.get("/viewAll", viewAll);
router.get("/searchAll", searchAll);
module.exports = router;
