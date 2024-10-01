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
const searchProductByName = async (req, res) => {
    try {
        const { name } = req.body; // Change from req.query to req.body
        if (!name) {
            return res.status(400).json({ message: 'Product name is required' });
        }

        const products = await Product.find({ name: new RegExp(name, 'i') });
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Filter products by price
const filterProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body; // Change from req.query to req.body
        if (!minPrice && !maxPrice) {
            return res.status(400).json({ message: 'At least one of minPrice or maxPrice is required' });
        }

        const query = {};
        if (minPrice) query.price = { $gte: Number(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

        const products = await Product.find(query);
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error filtering products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addProduct,
    updateProductByName,
    searchProductByName,
    filterProductsByPrice,
};