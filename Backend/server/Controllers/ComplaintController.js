const { default: mongoose } = require('mongoose');
const Complaint = require('../Models/Complaint');
const jwt = require('jsonwebtoken');

//create new complaint
const createComplaint = async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const newComplaint = new Complaint({ title, body, userId });
        await newComplaint.save();
        res.status(201).json({ message: 'Complaint created successfully', complaint: newComplaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update complaint status (admin only)
const updateComplaintStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id || !status) {
            return res.status(400).json({ message: 'ID and status are required' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Complaint status updated successfully', complaint: updatedComplaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all complaints (admin only) sorted by date & filter 
const getAllComplaints = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const { sortBy, status } = req.query;
        const filterCriteria = status ? { status } : {};
        const sortCriteria = sortBy === 'date' ? { date: -1 } : {};
        const complaints = await Complaint.find(filterCriteria).sort(sortCriteria);
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get complaint details by ID (admin only)
const getComplaintById = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const { id } = req.params;
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get complaints by user ID (tourist)
const getComplaintsByUserId = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const complaints = await Complaint.find({ userId });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    createComplaint,
    updateComplaintStatus,
    getAllComplaints,
    getComplaintById,
    getComplaintsByUserId
};