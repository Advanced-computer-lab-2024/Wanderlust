const express = require('express');
const router = express.Router();
const ComplaintController = require('../Controllers/ComplaintController');
const { authenticateUser } = require('../Controllers/authController');
const admin = require('../Models/Admin');

router.post('/complaint', authenticateUser, ComplaintController.createComplaint);
router.put('/complaint/status', authenticateUser, admin, ComplaintController.updateComplaintStatus);
router.get('/complaints', authenticateUser, admin, ComplaintController.getAllComplaints);
router.get('/complaint/:id', authenticateUser, admin, ComplaintController.getComplaintById);
router.get('/myComplaints', authenticateUser, ComplaintController.getComplaintsByUserId);

module.exports = router;

//run this command
//npm i jsonwebtoken

/*
create not yet working
so can't test status updatem
*/