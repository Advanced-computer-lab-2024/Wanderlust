const locationModel = require("../Models/Locations.js");
const { default: mongoose } = require("mongoose");

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

    res
      .status(201)
      .json({
        message: "Location created successfully",
        location: newLocation,
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating location", error });
  }
};

// Get all locations
const getLocations = async (req, res) => {
  try {
    const locations = await locationModel.find().populate("tags"); // Retrieve all locations from the database
    res.status(200).json(locations); // Send the locations as a response
  } catch (error) {
    res.status(500).json({ message: "Error retrieving locations", error });
  }
};

// Update an existing location by name
const updateLocation = async (req, res) => {
  try {
    const { name } = req.params; // Get the location name from the route parameters
    const {
      description,
      pictures,
      location,
      openingHours,
      ticketPrices,
      tags,
    } = req.body; // Destructure updated data from request body

    const updatedLocation = await locationModel.findOneAndUpdate(
      { name }, // Find location by name
      { description, pictures, location, openingHours, ticketPrices, tags },
      { new: true } // Return the updated document
    );

    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res
      .status(200)
      .json({
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
    const { name } = req.params; // Get the location name from the route parameters

    const deletedLocation = await locationModel.findOneAndDelete({ name }); // Find and delete location by name

    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting location", error });
  }
};
const filterLocations = async (req, res) => {
  const { tags } = req.body;
  try {
    const locations = await Locations.find({ tags: { $in: tags } });
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  filterLocations,
};
