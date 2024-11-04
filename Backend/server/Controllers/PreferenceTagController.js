const { default: mongoose } = require('mongoose');
const PreferenceTag = require('../Models/PreferenceTag');
const Tourist = require('../Models/Tourist');
const User = require('../Models/user');
//create and Read both work, delete and update not yet

// Create a new preference tag
const createPreferenceTag = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const newTag = new PreferenceTag({ name });
        await newTag.save();
        res.status(201).json({ message: 'Preference tag created successfully', tag: newTag });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Read all preference tags
const getPreferenceTags = async (req, res) => {
    try {
        const tags = await PreferenceTag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a preference tag
const updatePreferenceTag = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id || !name) {
            return res.status(400).json({ message: 'ID and Name are required' });
        }

        const updatedTag = await PreferenceTag.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedTag) {
            return res.status(404).json({ message: 'Preference tag not found' });
        }

        res.status(200).json({ message: 'Preference tag updated successfully', tag: updatedTag });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a preference tag
const deletePreferenceTag = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const deletedTag = await PreferenceTag.findByIdAndDelete(id);
        if (!deletedTag) {
            return res.status(404).json({ message: 'Preference tag not found' });
        }

        res.status(200).json({ message: 'Preference tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
//67292c47ce18dd9e4fc060cb tourist id for testing
// Update tourist preferences
const updateTouristPreferences = async (req, res) => {
    const { touristId } = req.params;
    const { preferences } = req.body;
  
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: 'Preferences must be an array of strings' });
    }
  
    try {
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
  
      tourist.preferences = preferences;
      await tourist.save();
  
      res.status(200).json({ message: 'Preferences updated successfully', tourist });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

module.exports = {
    createPreferenceTag,
    getPreferenceTags,
    updatePreferenceTag,
    deletePreferenceTag,
    updateTouristPreferences
};