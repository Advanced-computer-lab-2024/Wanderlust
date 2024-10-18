const jwt = require('jsonwebtoken');
const adminModel = require('../Models/Admin'); 
const tourismGovernorModel = require('../Models/TourismGovernor.js');
const tourguideModel = require('../Models/tourGuide'); 
const touristModel = require('../Models/Tourist.js');
const advertiserModel = require('../Models/Advertiser'); 
const sellerModel = require('../Models/Seller.js');
//routings in admin routing file
//if you wanna test in postman 1)login 2)copy given token 3)header add key=Authorization value= Bearer copied_token 4)write normal json

// Middleware to extract user info from token
const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Assuming the token contains the user's information
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// Dynamic login
const login = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        console.log('Login attempt:', { username, password, role }); 

        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Username, password, and role are required' });
        }

        const normalizedUsername = username.toLowerCase();
        const userCollections = {
            admin: adminModel,
            tourismGovernor: tourismGovernorModel,
            tourguide: tourguideModel,
            tourist: touristModel,
            advertiser: advertiserModel,
            seller: sellerModel,
        };

        const userModel = userCollections[role];
        if (!userModel) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await userModel.findOne({ username: normalizedUsername });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the password (plain text comparison)
        if (password !== user.password) {
            console.log('Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        });
    } catch (error) {
        console.error('Server error:', error); // Log the error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Dynamic update password
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: 'Old password and new password cannot be identical' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }
        console.log('Old Password:', oldPassword); 
        const userCollections = [
            { model: adminModel, role: 'admin' },
            { model: tourismGovernorModel, role: 'tourismGovernor' },
            { model: tourguideModel, role: 'tourguide' },
            { model: touristModel, role: 'tourist' },
            { model: advertiserModel, role: 'advertiser' },
            { model: sellerModel, role: 'seller' },
        ];

        let user = null;

        for (const collection of userCollections) {
            user = await collection.model.findById(req.user.id);
            if (user) {
                break;
            }
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (oldPassword !== user.password) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long and contain both letters and numbers.' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    login,
    updatePassword,
    authenticateUser,
};
