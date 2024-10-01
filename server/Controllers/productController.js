const Product = require('../Models/Products.js');

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
        if (!name || !description || !price || !quantity) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if a product with the same name already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists' });
        }

        const newProduct = new Product({ name, description, price, quantity });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error); // Log the error details
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update product price and description by name
const updateProductByName = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        if (!name || !price || !description) {
            return res.status(400).json({ message: 'Name, price, and description are required' });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { name },
            { price, description },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error); // Log the error details
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    addProduct,
    updateProductByName
};