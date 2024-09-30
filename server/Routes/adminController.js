const adminModel = require('../Models/Admin.js');
const { default: mongoose } = require('mongoose');
const tourismGovernorModel = require('../Models/TourismGovernor.js');

//each one add a method that is needed based on the requirements
//Create or add a new admin
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, role, username } = req.body;

        // Check if the username already exists
        const existingAdmin = await adminModel.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new admin
        const newAdmin = new adminModel({ name, email, password, role, username });

        // Save the new admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

};

//admin deleting account
const deleteAccount = async (req, res) => {
    try {
        const { username } = req.body;
        const account = await adminModel.findOne({ username });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        await account.deleteOne();
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// helper to know all admin usernames on system
const getAllUsernames = async (req, res) => {
    try {
        const accounts = await adminModel.find({}, 'username'); 
        const usernames = accounts.map(account => account.username);
        res.status(200).json(usernames);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
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
module.exports = { createAdmin, addTourismGovernor, deleteAccount, getAllUsernames };
