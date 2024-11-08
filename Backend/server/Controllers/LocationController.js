const locationModel = require("../Models/Locations.js");
const preferenceTagModel = require("../Models/PreferenceTag.js");
const { default: mongoose } = require("mongoose");
const { convertCurrency } = require('./currencyConverter');

// Create a new location
const createLocation = async (req, res) => {
  try {
    const {
      name,
      description,
      pictures,
      location,
      openingHours,
      ticketPrices,
      tags,
    } = req.body; // Destructure the required fields from request body

    const newLocation = new locationModel({
      name,
      description,
      pictures,
      location,
      openingHours,
      ticketPrices,
      tags,
    }); // Create a new location document

    await newLocation.save(); // Save the new location in the database

    res.status(201).json({
      message: "Location created successfully",
      location: newLocation,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating location", error });
  }
};

// Get all locations
const getLocations = async (req, res) => {
  const { currency } = req.query; // Get the selected currency from query parameters
  try {
    const locations = await locationModel.find().populate('tags');

    if (currency) {
      const convertedLocations = await Promise.all(
        locations.map(async (item) => {
          const convertedItem = item.toObject(); // Convert Mongoose document to plain JavaScript object
          convertedItem.ticketPrices = await convertCurrency(convertedItem.ticketPrices, currency); // Convert ticket price to selected currency
          return convertedItem;
        })
      );
      return res.status(200).json(convertedLocations);
    }

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error: error.message });
  }
};

// Update an existing location by name
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params; // Get the location ID from the route parameters
    const {
      name,
      description,
      pictures,
      location,
      openingHours,
      ticketPrices,
      tags,
    } = req.body; // Destructure updated data from request body

    const updatedLocation = await locationModel.findOneAndUpdate(
      { _id: id }, // Find location by ID
      {
        name,
        description,
        pictures,
        location,
        openingHours,
        ticketPrices,
        tags,
      }, // Update the fields, including name
      { new: true } // Return the updated document
    );

    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({
      message: "Location updated successfully",
      location: updatedLocation,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating location", error });
  }
};

// Delete a location by name
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params; // Get the location ID from the route parameters

    const deletedLocation = await locationModel.findByIdAndDelete(id); // Find and delete location by ID

    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting location", error });
  }
};

const filterLocations = async (req, res) => {
  const { name } = req.query;
  try {
    const tag = await preferenceTagModel.findOne({ name });
    const locations = await locationModel
      .find({ tags: { $in: tag._id } })
      .populate("tags");
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get a location by ID
const getLocationById = async (req, res) => {
  try {
    const location = await locationModel
      .findById(req.params.id)
      .populate("tags");
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving location", error });
  }
};

const searchLocations = async (req, res) => {
  const { query } = req.query;
  try {
    const locations = await locationModel.find().populate("tags");

    const filteredLocations = locations.filter((location) => {
      const nameMatches = location.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const tagMatches =
        location.tags &&
        location.tags.some((tags) =>
          tags.name.toLowerCase().includes(query.toLowerCase())
        );

      return nameMatches || tagMatches;
    });
    res.status(200).json(filteredLocations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  filterLocations,
  getLocationById,
  searchLocations,
};
