const adminModel = require('../Models/Admin.js');
const { default: mongoose } = require('mongoose');
const tourismGovernorModel = require('../Models/TourismGovernor.js');

//each one add a method that is needed based on the requirements
//Create or add a new admin - Amgad
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

//deleting account based on the username
const deleteAccount = async (req, res) => {
    try {
      const { username } = req.body;
      const adminAccount = await adminModel.findOne({ username });
      const tourismGovernorAccount = await tourismGovernorModel.findOne({ username });
  
      if (adminAccount) {
        await adminAccount.deleteOne();
        res.status(200).json({ message: 'Admin account deleted successfully' });
      } else if (tourismGovernorAccount) {
        await tourismGovernorAccount.deleteOne();
        res.status(200).json({ message: 'Tourism governor account deleted successfully' });
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

// helper get all usernames on system and account type
const getAllUsernames = async (req, res) => {
    try {
        const adminAccounts = await adminModel.find({}, 'username role');
        const tourismGovernorAccounts = await tourismGovernorModel.find({}, 'username role');


        const accounts = [
            ...adminAccounts.map(account => ({ username: account.username, accountType: 'admin' })),
            //...userAccounts.map(account => ({ username: account.username, accountType: 'user' })),
            ...tourismGovernorAccounts.map(account => ({ username: account.username, accountType: 'tourismGovernor' }))
        ];

        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching usernames:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
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
