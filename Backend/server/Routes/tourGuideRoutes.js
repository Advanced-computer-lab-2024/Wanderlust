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
  checkForFlagged,
} = require("../Controllers/tourGuideController");
const { createSystemNotification,sendUpcomingActivityNotifications, sendUpcomingItineraryNotifications, requestNotification,getNotificationsAll } = require("../Controllers/NotificationController");


router.put("/createtgprofile/:userId", createTourGuideProfile);
router.get("/gettgprofile", getTourGuide);
router.put("/updatetgprofile", updateTourGuide);
router.put("/saveidurl", saveTourGuideIdUrl);
router.post("/rate/:tourGuideId", rateTourGuide);
router.get("/salesreport/:tourGuideId", getSalesReport);
router.get("/salesreport/filter", filterSalesReport);
router.get("/touristreport/:tourGuideId", getTouristReport);
router.get("/touristreport/filter/:tourGuideId", filterTouristReportByMonth);
router.get("/checkflagged/:tourGuideId", checkForFlagged);
router.get('/getNotificationsAll', getNotificationsAll);

module.exports = router;
