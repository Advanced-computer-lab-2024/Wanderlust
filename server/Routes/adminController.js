const adminModel = require('../Models/Admin.js');
const { default: mongoose } = require('mongoose');
const tourismGovernorModel = require('../Models/TourismGovernor.js');

//each one add a method that is needed based on the requirements
//Create or add a new admin - Amgad
const createAdmin = async (req, res) => {


};

// Create a new tourism governor
const addTourismGovernor = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingGovernor = await tourismGovernorModel.findOne({ username });
        if (existingGovernor) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new tourism governor
        const newGovernor = new tourismGovernorModel({ username, password });

        // Save the new governor to the database
        await newGovernor.save();

        res.status(201).json({ message: 'Tourism governor created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



//add a , then the name of ur mehtod below.
module.exports = { createAdmin, addTourismGovernor };
