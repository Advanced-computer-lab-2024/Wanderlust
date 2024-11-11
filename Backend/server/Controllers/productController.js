const Product = require("../Models/Products.js");
const jwt = require('jsonwebtoken');
const { convertCurrency } = require('./currencyConverter');
const Tourist = require('../Models/Tourist');

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      rating,
      reviews,
      seller,
      picture,
    } = req.body;
    if (!name || !description || !price || !quantity ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      rating,
      reviews,
      seller,
      picture,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error); // Log the error details
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product price and description by name
const updateProductByName = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ message: "Name, price, and description are required" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { name },
      { price, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error); // Log the error details
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const searchProductByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const products = await Product.find({
      name: new RegExp(name, "i"),
    }).populate("seller");
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Filter products by price
const filterProductsByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    if (!minPrice && !maxPrice) {
      return res
        .status(400)
        .json({ message: "At least one of minPrice or maxPrice is required" });
    }

    const query = {};
    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    const products = await Product.find(query).populate("seller");

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error filtering products by price:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProductsSortedByRating = async (req, res) => {
  try {
    const sortOrder = req.query.sort === "asc" ? 1 : -1;
    const products = await Product.find()
      .sort({ rating: sortOrder })
      .populate("seller");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//For tourists
const viewAvailableProducts = async (req, res) => {
  const { touristId } = req.query; // Get the tourist ID from query parameters
  try {
    const products = await Product.find({ archived: false }).populate("seller");

    let currency = 'EGP'; // Default currency
    if (touristId) {
      const tourist = await Tourist.findById(touristId);
      if (tourist && tourist.currency) {
        currency = tourist.currency; // Use tourist's preferred currency
      }
    }

    const convertedProducts = await Promise.all(
      products.map(async (item) => {
        const convertedItem = item.toObject(); // Convert Mongoose document to plain JavaScript object
        convertedItem.price = await convertCurrency(convertedItem.price, currency, touristId); // Convert price to selected currency
        return convertedItem;
      })
    );

    return res.status(200).json(convertedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//tourist rate a product they purschased
const rateProduct = async (req, res) => {
  try {
      const { productId, rating, review } = req.body;
      if (!productId || !rating) {
          return res.status(400).json({ message: 'Product ID and rating are required' });
      }

      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const existingRating = product.ratings.find(r => r.userId.toString() === userId);
      if (existingRating) {
          existingRating.rating = rating;
          existingRating.review = review;
      } else {
          product.ratings.push({ userId, rating, review });
      }

      await product.save();
      res.status(200).json({ message: 'Rating added successfully', product });
  } catch (error) {
      console.error('Error rating product:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// For admin
const viewAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProductByName = async (req, res) => {
  try {
    const { name } = req.body;
    const deletedProduct = await Product.findOneAndDelete({ name });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const archiveProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const archivedProduct = await Product.findOneAndUpdate(
      { name },
      { archived: true }
    );
    if (!archivedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product archived successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unarchiveProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const unarchivedProduct = await Product.findOneAndUpdate(
      { name },
      { archived: false }
    );
    if (!unarchivedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product unarchived successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View available quantity and sales of a product (admin and seller only)
const viewProductDetails = async (req, res) => {
  try {
      const { productId } = req.params;
      const product = await Product.findById(productId).populate('sales.userId', 'username');
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ quantity: product.quantity, sales: product.sales });
  } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a sale to a product
const addSale = async (req, res) => {
  try {
      const { productId, quantity } = req.body;
      if (!productId || !quantity) {
          return res.status(400).json({ message: 'Product ID and quantity are required' });
      }

      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      if (product.quantity < quantity) {
          return res.status(400).json({ message: 'Insufficient product quantity' });
      }

      product.sales.push({ userId, quantity });
      product.quantity -= quantity;

      await product.save();
      res.status(200).json({ message: 'Sale added successfully', product });
  } catch (error) {
      console.error('Error adding sale:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addProduct,
  updateProductByName,
  searchProductByName,
  filterProductsByPrice,
  getProductsSortedByRating,
  viewAvailableProducts,
  viewAllProducts,
  deleteProductByName,
  archiveProduct,
  unarchiveProduct,
  rateProduct,
  viewProductDetails,
  addSale,
};
