const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");
const {
  login,
  updatePassword,
  authenticateUser,
  getLoggedInUser,
  getLoggedInInfo,
  requestDeleteAccount,
  acceptTerms,
} = require("../Controllers/authController");

router.use(express.json());
router.post("/addTourismGovernor", adminController.addTourismGovernor);
router.delete("/delete", adminController.deleteAccount);
router.get("/usernames", adminController.getAllUserDetails);
router.post("/create", adminController.createAdmin);
router.get("/pendingUsers", adminController.getPendingUsers);
router.put("/approvePendingUser/:userId", adminController.approvePendingUser);
router.get("/profile", adminController.getAdminDetails);
//router.post("/updatepassword", adminController.authenticateAdmin,adminController.updateAdminPassword);
router.get('/userStatistics',adminController.getUserStatistics);
router.post('/createPromoCode', adminController.createPromoCode);
router.get('/getNotifications', adminController.getNotifications);
router.get('/promoCodes', adminController.getPromoCodes);
router.get('/allSalesReport', adminController.getAllSalesReport);
router.get('/filterSalesReport', adminController.filterSalesReport);
router.post("/login", login);
router.post("/updatepassword", authenticateUser, updatePassword);
router.get("/getLoggedInUser", getLoggedInUser);
router.get("/getLoggedInInfo", getLoggedInInfo);
router.post("/acceptTerms", acceptTerms);
router.get("/requestDeleteAccount", requestDeleteAccount);

module.exports = router;
