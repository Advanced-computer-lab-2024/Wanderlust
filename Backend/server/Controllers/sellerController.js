// #Task route solution
const SellerModel = require('../Models/Seller.js');
const { default: mongoose } = require('mongoose');

const createSeller = async (req, res) => {
   try {
       const { name, email, password, role, username, description } = req.body; // Assuming the data is coming in the request body

       const newSeller = new SellerModel({ name, email, password, role, username, description }); // Create a new Seller document
       await newSeller.save(); // Save the Seller to the database

       res.status(201).json({ message: 'Seller created successfully', Seller: newSeller });
   } catch (error) {
       res.status(500).json({ message: 'Error creating Seller', error });
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
        const { name, email, password, role, username, description } = req.body; // Updated Seller data in the request body

        // Use findByIdAndUpdate to update by ID
        const updatedSeller = await SellerModel.findByIdAndUpdate(id, { name, email, password, role, username, description }, { new: true });

        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json({ message: 'Seller updated successfully', Seller: updatedSeller });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Seller', error });
    }
};

 

// Delete a Seller
const deleteSeller = async (req, res) => {
    try {
        const { name } = req.params; // Assuming the Seller name is passed as a route parameter
 
        const deletedSeller = await SellerModel.findOneAndDelete({ name }); // Find and delete the Seller by name
 
        if (!deletedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
 
        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Seller', error });
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

module.exports = { createSeller, getSellers, getSellerById, updateSeller, deleteSeller };

 
