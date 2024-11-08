const axios = require('axios');
const Itinerary = require("../Models/Itinerary");
const Activity = require("../Models/Activity");
const PreferenceTagModel = require("../Models/PreferenceTag");
const { convertCurrency } = require('./currencyConverter');

const createItinerary = async (req, res) => {
  const {
    title,
    activities,
    locations,
    timeline,
    languageOfTour,
    price,
    rating,
    availableDates,
    accessibility,
    pickupLocation,
    dropoffLocation,
  } = req.body;
  try {
    const itinerary = await Itinerary.create({
      title,
      activities,
      locations,
      timeline,
      languageOfTour,
      price,
      rating,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
    });
    const populatedItenary = await Itinerary.findById(itinerary._id).populate(
      "activities"
    );
    res.status(200).json(populatedItenary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//u have to enter currency wanted in postman example
//http://localhost:8000/api/itinerary/getItinerary?currency=EUR
const getItinerary = async (req, res) => {
  const { currency } = req.query; // Get the selected currency from query parameters
  try {
    const itineraries = await Itinerary.find().populate({
      path: 'activities',
      populate: { path: 'category tags' },
    });

    if (currency) {
      const convertedItineraries = await Promise.all(
        itineraries.map(async (item) => {
          const convertedItem = item.toObject(); // Convert Mongoose document to plain JavaScript object
          convertedItem.price = await convertCurrency(convertedItem.price, currency); // Convert itinerary price to selected currency

          // Convert prices of activities within the itinerary
          convertedItem.activities = await Promise.all(
            convertedItem.activities.map(async (activity) => {
              activity.price = await convertCurrency(activity.price, currency);
              return activity;
            })
          );

          return convertedItem;
        })
      );
      return res.status(200).json(convertedItineraries);
    }

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateItinerary = async (req, res) => {
  const {
    id,
    title,
    activities,
    locations,
    timeline,
    languageOfTour,
    price,
    rating,
    availableDates,
    accessibility,
    pickupLocation,
    dropoffLocation,
  } = req.body;
  try {
    const itenary = await Itinerary.findById(id);
    if (!itenary) {
      return res.status(404).json({ error: "Itenary not found" });
    }
    const updatedItenary = await Itinerary.findOneAndUpdate(
      { _id: id },
      {
        title,
        activities,
        locations,
        timeline,
        languageOfTour,
        price,
        rating,
        availableDates,
        accessibility,
        pickupLocation,
        dropoffLocation,
      },
      { new: true }
    );
    res.status(200).json(updatedItenary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteItinerary = async (req, res) => {
  const { id } = req.body;
  try {
    const itenary = await Itinerary.findByIdAndDelete(id);
    if (!itenary) {
      return res.status(404).json({ error: "Itenary not found" });
    }
    res.status(200).json(itenary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sortItineraries = async (req, res) => {
  try {
    const { sortBy = "price", orderBy = "1" } = req.query; // Set default values
    const sortQuery = { [sortBy]: parseInt(orderBy) }; // Ensure orderBy is an integer
    const itineraries = await Itinerary.find()
      .sort(sortQuery)
      .populate({
        path: "activities",
        populate: [
          {
            path: "category",
            model: "ActivityCat",
          },
          { path: "tags", model: "PreferenceTag" },
        ],
      });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Search for Itinerary by name or tags
const searchItinerary = async (req, res) => {
  const { query } = req.query;
  try {
    const itinerary = await Itinerary.find().populate({
      path: "activities",
      populate: [
        {
          path: "category",
          model: "ActivityCat",
        },
        { path: "tags", model: "PreferenceTag" },
      ],
    });
    const filteredItinerary = itinerary.filter((itinerary) => {
      const titleMatches = itinerary.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const activitiesMatches =
        itinerary.activities &&
        itinerary.activities.some((activity) =>
          activity.name.toLowerCase().includes(query.toLowerCase())
        );
      return titleMatches || activitiesMatches;
    });
    res.status(200).json(filteredItinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const filterItinerairies = async (req, res) => {
  try {
    const { minBudget, maxBudget, date, language } = req.query;

    const query = {};
    if (minBudget !== undefined && maxBudget !== undefined) {
      query.price = { $gte: minBudget, $lte: maxBudget };
    }
    if (date !== undefined) {
      query.availableDates = { $in : new Date(date)};
    }

    if (language !== undefined) {
      query.languageOfTour = language;
    }

    // const itineraries = await Itinerary.find(query);
    const itineraries = await Itinerary.find(query).populate({
      path: "activities",
      populate: {
        path: "category",
        model: "ActivityCat",
      },
    });

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const filterItinerariesByPref = async (req, res) => {
  try {
    const { preference } = req.query;
    
    if ( preference === 'undefined') {
      console.log("No preference tag provided");
      const itineraries = await Itinerary.find().populate({
        path: 'activities',
        populate: { path: 'category tags' }
      });
      return res.status(200).json(itineraries);
    }
      const tag = await PreferenceTagModel.findOne({ name: preference });
      if (!tag) {
        return res.status(404).json({ message: "Preference tag not found" });
      }
      const activities = await Activity.find({ tags: tag._id });

      const itineraries = await Itinerary.find({ activities: { $in: activities.map(a => a._id) } })
        .populate({
          path: 'activities',
          populate: {
            path: 'tags',
            model: 'PreferenceTag'
          }
        });
        res.status(200).json(itineraries);
      }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const bookItinerary = async (req, res) => {
  try {
      const { itineraryId, userId } = req.body;

      // Create a new booking
      const newBooking = new Booking({
          itineraryId,
          userId,
      });

      await newBooking.save(); // Save to the database

      res.status(201).json({ message: 'Booking successful!' });
  } catch (error) {
      console.error('Error booking itinerary:', error);
      res.status(500).json({ message: 'Error booking itinerary' });
  }
};
const cancelItineraryBooking = async (req, res) => {
  const { bookingId } = req.params; // Get the booking ID from the request params

  try {
      const booking = await ItineraryBooking.findById(bookingId);

      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }

      // Check if the itinerary start time is more than 48 hours away
      const currentTime = new Date();
      const itineraryTime = new Date(booking.itineraryStartTime); // Assume you have an itineraryStartTime field

      const timeDifference = itineraryTime - currentTime; // in milliseconds
      const hoursDifference = timeDifference / (1000 * 60 * 60); // convert to hours

      if (hoursDifference < 48) {
          return res.status(400).json({ message: "Cannot cancel booking less than 48 hours before the itinerary" });
      }

      // If it's more than 48 hours, proceed to cancel the booking
      await ItineraryBooking.deleteOne({ _id: bookingId });
      return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
      return res.status(500).json({ message: "Error cancelling booking" });
  }
};

const addComment = async (req, res) => {
  const { itineraryId } = req.params; // Get itinerary ID from URL parameters
  const { userId, comment } = req.body; // Get user ID and comment from request body

  try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
          return res.status(404).json({ message: "Itinerary not found" });
      }

      itinerary.comments.push({ userId, comment });
      await itinerary.save();

      res.status(200).json({ message: "Comment added successfully!", itinerary });
  } catch (error) {
      res.status(500).json({ message: "Error adding comment", error });
  }
};

const activateDeactivateItinerary = async (req, res) => {
  const { id } = req.params; // Get itinerary ID from request parameters

  try {
      // Find the itinerary by ID
      const itinerary = await Itinerary.findById(id);
      
      // If itinerary not found, return error
      if (!itinerary) {
          return res.status(404).json({ message: 'Itinerary not found.' });
      }

      // Check if there are bookings associated with this itinerary
      const hasBookings = itinerary.bookings && itinerary.bookings.length > 0;

      // If there are bookings, toggle the active status
      if (hasBookings) {
          itinerary.isActive = !itinerary.isActive; // Toggle active status
          await itinerary.save(); // Save the updated itinerary
          return res.status(200).json({ message: `Itinerary has been ${itinerary.isActive ? 'activated' : 'deactivated'}.` });
      } else {
          // If there are no bookings, return an error
          return res.status(400).json({ message: 'Itinerary cannot be deactivated because it has no bookings.' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating itinerary.' });
  }
};


module.exports = {
  createItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  sortItineraries,
  searchItinerary,
  filterItinerairies,
  filterItinerariesByPref,
  bookItinerary,
  cancelItineraryBooking,
  addComment,
  activateDeactivateItinerary
};
