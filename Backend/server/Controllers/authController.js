const jwt = require('jsonwebtoken');
const adminModel = require('../Models/Admin'); 
const tourismGovernorModel = require('../Models/TourismGovernor.js');
const tourguideModel = require('../Models/tourGuide'); 
const touristModel = require('../Models/Tourist.js');
const advertiserModel = require('../Models/Advertiser'); 
const sellerModel = require('../Models/Seller.js');
const actualUserModel = require('../Models/user.js');
const userSchema = require('../Models/user.js');

const axios = require('axios');

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
        if(role === 'admin' || role === 'tourismGovernor'){
            const userCollections = {
                tourismGovernor: tourismGovernorModel,
                admin: adminModel,
            };
            const userModel = userCollections[role];
            if (!userModel) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            const user = await userModel.findOne({ username: username });
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }
            if (password !== user.password) {
                console.log('Invalid credentials');
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Login successful',
                user: user,
                token
            });

            } else{
        
            const user = await actualUserModel.findOne({ username: username });
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }

        // Verify the password (plain text comparison)
            if (password !== user.password) {
                console.log('Invalid credentials');
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            if( user.roleApplicationStatus != "approved"){
                console.log('Your application is still pending');
                return res.status(400).json({ message: 'Your application is still pending' });

            }
            const userCollections = {
                tourguide: tourguideModel,
                tourist: touristModel,
                advertiser: advertiserModel,
                seller: sellerModel,
            };
    
            const userModel = userCollections[role];
            if (!userModel) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            const userToken = await userModel.findOne({ userId: user._id });
            if (!userToken) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }
            const token = jwt.sign({ id: userToken._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Login successful',
                user: userToken,
                token
            });
        }


        // Generate JWT token

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
        const userCollections = {
            admin : adminModel,
            tourismGovernor : tourismGovernorModel,
        };
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const role = decodedToken.role;
        console.log(   role );

        if (role === 'admin' || role === 'tourismGovernor') {
            const userModel = userCollections[role];
            const user = await userModel.findById(userId);
            if (!userModel) {
                return res.status(400).json({ message: 'Invalid role' });
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
        }else{
            const token = req.headers.authorization;

            // Call the getLoggedInInfo API to retrieve the logged-in user's information
            const response = await axios.get('http://localhost:8000/api/admin/getLoggedInInfo', {
                headers: { Authorization: token }
            });

            const user = response.data;
            console.log("userPass:" +user.password,"oldPass: "+ oldPassword);

            // If user is not found, return an error
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
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
            // Now get the actual user model
            const actualUser = await actualUserModel.findById(user._id); // Assuming `user._id` is the actual user's ID
            if (!actualUser) {
                return res.status(404).json({ message: 'Actual user not found' });
            }

            // Update the password for the actual user
            actualUser.password = newPassword;
            await actualUser.save();
            res.status(200).json({ message: 'Password updated successfully' });
     }
    } catch (error) {
        console.error('Error updating password:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const getLoggedInUser = async (req, res) => {
    try {
        console.log('Getting logged in user');
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userCollections = {
            admin: adminModel,
            tourismGovernor: tourismGovernorModel,
            tourguide: tourguideModel,
            tourist: touristModel,
            advertiser: advertiserModel,
            seller: sellerModel,
        };

        const userModel = userCollections[decoded.role];
        if (!userModel) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await userModel.findOne({ _id : decoded.id });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error getting user:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getLoggedInInfo = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userCollections = {
            tourismGovernor: tourismGovernorModel,
            tourguide: tourguideModel,
            tourist: touristModel,
            advertiser: advertiserModel,
            seller: sellerModel,
        };

        const userModel = userCollections[decoded.role];
        if (!userModel) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await userModel.findOne({ _id : decoded.id });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        const actualUser = await actualUserModel.findOne({ _id : user.userId });
        res.status(200).json(actualUser);
    }
    catch (error) {
        console.error('Error getting user:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const acceptTerms = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userCollections = {
            tourguide: tourguideModel,
            advertiser: advertiserModel,
            seller: sellerModel,
        };

        const userModel = userCollections[decoded.role];
        if (!userModel) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await userModel.findOne({ _id : decoded.id });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        const actualUser = await actualUserModel.findOne({ _id : user.userId });
        actualUser.termsAccepted = true;
        await actualUser.save();
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Error accepting terms:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    login,
    updatePassword,
    authenticateUser,
    getLoggedInUser,
    getLoggedInInfo,
    acceptTerms,
};
