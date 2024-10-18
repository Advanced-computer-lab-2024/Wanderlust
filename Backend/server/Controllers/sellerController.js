// #Task route solution
const SellerModel = require('../Models/Seller.js');
const { default: mongoose } = require('mongoose');

const createSeller = async (req, res) => {
    const { username, email, password, mobileNumber, name, description, termsAccepted } = req.body;

    if (!termsAccepted) {
      return res.status(400).json({ error: "Terms and conditions must be accepted." });
    }
  
    try {
      const seller = await SellerModel.create({ username, email, password, mobileNumber, name, description, termsAccepted, role:'tourist' });
      res.status(200).json(seller);
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

 
