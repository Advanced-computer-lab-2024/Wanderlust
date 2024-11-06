// #Task route solution
const SellerModel = require('../Models/Seller.js');
const { default: mongoose } = require('mongoose');
const User = require("../Models/user");

//u have to sign up first and get the id given
//http://localhost:8000/api/seller/createSeller/userId
const createSeller = async (req, res) => {
    const { userId } = req.params;
    const { description , type } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const seller = new SellerModel({
          userId: user._id,
          description,
          type,
        });
        user.role = "seller";
        user.roleApplicationStatus = "pending";
        await seller.save();
        await user.save();
        res.status(200).json({
          user,
          seller,
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
    

// Get all Sellers
const getSellers = async (req, res) => {
   try {
       const Sellers = await SellerModel.find(); // Retrieve all Sellers from the database
       res.status(200).json(Sellers); // Send the Sellers as a response
   } catch (error) {
       res.status(500).json({ message: 'Error retrieving Sellers', error });
   }
};

// Update an existing Seller
const updateSeller = async (req, res) => {
    try {
        const { id } = req.params; // Get the seller ID from the route parameters
        const { name, email, description } = req.body; // Updated Seller data in the request body

        // Use findByIdAndUpdate to update by ID
        const updatedSeller = await SellerModel.findByIdAndUpdate(id, { name, email, description }, { new: true });

        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json({ message: 'Seller updated successfully', Seller: updatedSeller });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Seller', error });
    }
};


 // Get a specific Seller by ID
const getSellerById = async (req, res) => {
    try {
        const { id } = req.params; // Get the seller ID from the route parameters
        const seller = await SellerModel.findById(id); // Find the seller by ID

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json(seller); // Send the seller as a response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Seller', error });
    }
};

module.exports = { createSeller, getSellers, getSellerById, updateSeller };

 
