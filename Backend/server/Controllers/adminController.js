const adminModel = require('../Models/Admin.js');
const tourismGovernorModel = require('../Models/TourismGovernor.js');
const tourguideModel = require('../Models/tourGuide'); 
const touristModel = require('../Models/Tourist.js');
const advertiserModel = require('../Models/Advertiser'); 
const sellerModel = require('../Models/Seller.js');
const User = require('../Models/user');
//npm install jsonwebtoken
const jwt = require('jsonwebtoken');

// Get admin details by username
const getAdminDetails = async (req, res) => {
    try {
        const { username } = req.query;
        const adminAccount = await adminModel.findOne({ username });

        if (adminAccount) {
            res.status(200).json({
                id: adminAccount._id,
                name: adminAccount.name,
                email: adminAccount.email,
                username: adminAccount.username
            });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const createAdmin = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        const existingAdmin = await adminModel.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const newAdmin = new adminModel({ name, email, password, username });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//deleting account based on the id
const deleteAccount = async (req, res) => {
    try {
        const { id } = req.body;
        const adminAccount = await adminModel.findById(id);
        const tourismGovernorAccount = await tourismGovernorModel.findById(id);
        const tourguideAccount = await tourguideModel.findById(id);
        const touristAccount = await touristModel.findById(id);
        const advertiserAccount = await advertiserModel.findById(id);
        const sellerAccount = await sellerModel.findById(id); 

        if (adminAccount) {
            await User.findByIdAndDelete(adminAccount.userId);
            await adminAccount.deleteOne();
            res.status(200).json({ message: 'Admin account deleted successfully' });
          } else if (tourismGovernorAccount) {
            await User.findByIdAndDelete(tourismGovernorAccount.userId);
            await tourismGovernorAccount.deleteOne();
            res.status(200).json({ message: 'Tourism governor account deleted successfully' });
          } else if (tourguideAccount) {
            await User.findByIdAndDelete(tourguideAccount.userId);
            await tourguideAccount.deleteOne();
            res.status(200).json({ message: 'Tourguide account deleted successfully' });
          } else if (touristAccount) {
            await User.findByIdAndDelete(touristAccount.userId);
            await touristAccount.deleteOne();
            res.status(200).json({ message: 'Tourist account deleted successfully' });
          } else if (advertiserAccount) {
            await User.findByIdAndDelete(advertiserAccount.userId);
            await advertiserAccount.deleteOne();
            res.status(200).json({ message: 'Advertiser account deleted successfully' });
          } else if (sellerAccount) {
            await User.findByIdAndDelete(sellerAccount.userId);
            await sellerAccount.deleteOne();
            res.status(200).json({ message: 'Seller account deleted successfully' });
          } else {
            res.status(404).json({ message: 'Account not found' });
          }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// helper get all usernames on system and account type
const getAllUserDetails = async (req, res) => {
    try {
        const adminAccounts = await adminModel.find({}, '_id username email password role');
        const tourismGovernorAccounts = await tourismGovernorModel.find({}, '_id username email password role');
        const userAccounts = await User.find({}, '_id username email password role');

        const accounts = [
            ...adminAccounts.map(account => ({ id: account._id, username: account.username, email: account.email, password: account.password, accountType: 'admin' })),
            ...tourismGovernorAccounts.map(account => ({ id: account._id, username: account.username, email: account.email, password: account.password, accountType: 'tourismGovernor' })),
            ...userAccounts.map(account => ({id: account._id, username: account.username, email: account.email, password: account.password, accountType: account.role })),
        ];
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Get all pending users
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ roleApplicationStatus: 'pending' });
        res.status(200).json(pendingUsers);
    } catch (error) {
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
        const newGovernor = new tourismGovernorModel({ username, password });
        await newGovernor.save();
        res.status(201).json({ message: 'Tourism governor created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = { createAdmin, 
                    addTourismGovernor, 
                    deleteAccount, 
                    getAllUserDetails, 
                    getAdminDetails,
                    getPendingUsers};
