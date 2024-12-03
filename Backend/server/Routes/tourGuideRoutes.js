const express = require("express");
const router = express.Router();

const {
  createTourGuideProfile,
  getTourGuide,
  updateTourGuide,
  saveTourGuideIdUrl,
  rateTourGuide,
  getSalesReport,
  filterSalesReport,
  getTouristReport,
  filterTouristReportByMonth,
  
} = require("../Controllers/tourGuideController");

router.put("/createtgprofile/:userId", createTourGuideProfile);
router.get("/gettgprofile", getTourGuide);
router.put("/updatetgprofile", updateTourGuide);
router.put("/saveidurl", saveTourGuideIdUrl);
router.post("/rate/:tourGuideId", rateTourGuide);
router.get("/salesreport/:tourGuideId", getSalesReport);
router.get("/salesreport/filter", filterSalesReport);
router.get("/touristreport/:tourGuideId", getTouristReport);
router.get("/touristreport/filter/:tourGuideId", filterTouristReportByMonth);



module.exports = router;
