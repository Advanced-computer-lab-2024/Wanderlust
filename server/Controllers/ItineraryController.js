const { default: mongoose } = require('mongoose');

const Itinerary = require('../Models/Itinerary');
const Activity = require('../Models/Activity');

const createItinerary = async (req, res) => {
    const { title, activities, locations, timeline, languageOfTour, price, availableDates, accessibility, pickupLocation, dropoffLocation } = req.body;
    try {
        const itinerary = await Itinerary.create({ title, activities, locations, timeline, languageOfTour, price, availableDates, accessibility, pickupLocation, dropoffLocation });
        const populatedItenary = await Itinerary.findById(itinerary._id).populate('activities');
        res.status(200).json(populatedItenary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.find().populate({
            path: 'activities',
            populate: { path: 'category tags' } // Populate nested fields if needed
        });
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateItinerary = async (req, res) => {
    const { id, title, activities, locations, timeline, languageOfTour, price, availableDates, accessibility, pickupLocation, dropoffLocation } = req.body;
    try {
        const itenary = await Itinerary.findById(id);
        if (!itenary) {
            return res.status(404).json({ error: "Itenary not found" });
        }
        const updatedItenary = await Itinerary.findOneAndUpdate({ _id: id }, { title, activities, locations, timeline, languageOfTour, price, availableDates, accessibility, pickupLocation, dropoffLocation }, { new: true });
        res.status(200).json(updatedItenary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const deleteItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itenary = await Itinerary.findByIdAndDelete(id);
        if (!itenary) {
            return res.status(404).json({ error: "Itenary not found" });
        }
        res.status(200).json(itenary);
    }   
    catch (error) {
        res.status(400).json({ error: error.message });
    }   
}

module.exports = { createItinerary ,
    getItinerary ,
    updateItinerary ,
    deleteItinerary


};