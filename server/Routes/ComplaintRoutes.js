const express = require('express');
const router = express.Router();
const ComplaintController = require('../Controllers/ComplaintController');
const authenticateToken = require('../middleware/auth');
const admin = require('../Models/Admin');

router.post('/complaint', authenticateToken, ComplaintController.createComplaint);
router.put('/complaint/status', authenticateToken, admin, ComplaintController.updateComplaintStatus);
router.get('/complaints', authenticateToken, admin, ComplaintController.getAllComplaints);
router.get('/complaint/:id', authenticateToken, admin, ComplaintController.getComplaintById);
router.get('/myComplaints', authenticateToken, ComplaintController.getComplaintsByUserId);

module.exports = router;

//run this command
//npm i jsonwebtoken
