//this is a new file, new attept to fix Activity catgory controller

const { default: mongoose } = require('mongoose');
const ActivityCat = require('../Models/ActivityCat');

// Create a new activity category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await ActivityCat.create({ name, description });
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all activity categories
const getCategories = async (req, res) => {
    try {
        const categories = await ActivityCat.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//update activity category based on the id
//to update put id in body with new name and description
const updateCategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        if (!id || !name || !description) {
            return res.status(400).json({ message: 'ID, Name, and Description are required' });
        }

        const updatedCategory = await ActivityCat.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//delete activity category based on the id
//put id in body to delete
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const deletedTag = await ActivityCat.findByIdAndDelete(id);
        if (!deletedTag) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
