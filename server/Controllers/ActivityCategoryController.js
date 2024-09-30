
const { default: mongoose } = require('mongoose');
const activityCategoryModel = require('../Models/ActivityCategory.js');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new activityCategoryModel({ name });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Category already exists' });
        } else {
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

//Get all activity categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await activityCategoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const category = await activityCategoryModel.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const category = await activityCategoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createCategory, getAllCategories, updateCategory, deleteCategory };

