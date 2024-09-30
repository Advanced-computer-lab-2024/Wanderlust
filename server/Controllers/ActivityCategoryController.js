
const { default: mongoose } = require('mongoose');
const activityCategoryModel = require('../Models/ActivityCategory.js');

//CRUD Mehthods
//Create or add a new activity category
const createCategory = async (req, res) => {
    try {
        const { name, customId } = req.body;
        if (!name) {
          return res.status(400).json({ message: 'Name is required' });
        }
    
        if (!mongoose.Types.ObjectId.isValid(customId)) {
          return res.status(400).json({ message: 'Invalid category ID' });
        }
    
        const newCategory = new activityCategoryModel({
          customId: customId,
          name
        });
    
        await newCategory.save();
        res.status(201).json(newCategory);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

//Get all activity categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await activityCategoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//update activity category - still not working
const updateCategory = async (req, res) => {
    try {
        const { customId, name } = req.body;

        //if (!mongoose.Types.ObjectId.isValid(customId)) {
          //  return res.status(400).json({ message: 'Invalid category ID' });
        //}

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const updatedCategory = await activityCategoryModel.findByIdAndUpdate(
            customId,
            { name },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//delete activity category - still not working 
const deleteCategory = async (req, res) => {
    try {
        const { customId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(customId)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const deletedCategory = await activityCategoryModel.findByIdAndDelete(customId);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

module.exports = { createCategory, getAllCategories, updateCategory, deleteCategory };

