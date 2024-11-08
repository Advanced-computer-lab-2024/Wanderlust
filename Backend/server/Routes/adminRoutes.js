const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { login, updatePassword, authenticateUser, getLoggedInUser , getLoggedInInfo , acceptTerms} = require('../Controllers/authController');

router.use(express.json())
router.post("/addTourismGovernor",adminController.addTourismGovernor);
router.delete("/delete", adminController.deleteAccount);
router.get("/usernames", adminController.getAllUserDetails);
router.post("/create", adminController.createAdmin);
router.get("/pendingUsers", adminController.getPendingUsers);
router.get("/profile", adminController.getAdminDetails);
//router.post("/updatepassword", adminController.authenticateAdmin,adminController.updateAdminPassword);

router.post('/login', login);
router.post('/updatepassword', authenticateUser, updatePassword);
router.get('/getLoggedInUser', getLoggedInUser);
router.get('/getLoggedInInfo', getLoggedInInfo);
router.post('/acceptTerms', acceptTerms);


module.exports = router;