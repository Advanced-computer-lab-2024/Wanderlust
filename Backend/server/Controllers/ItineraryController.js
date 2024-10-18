const axios = require('axios');
const Itinerary = require("../Models/Itinerary");
const Activity = require("../Models/Activity");
const PreferenceTagModel = require("../Models/PreferenceTag");

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

const getExchangeRates = async (req, res) => {
  try {
    const response = await axios.get('https://v6.exchangerate-api.com/v6/77676a6e9ec92dc31f556a19/latest/USD'); 
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//u have to enter currency wanted in postman example
//http://localhost:8000/api/itinerary/getItinerary?currency=EUR
const getItinerary = async (req, res) => {
  const { currency } = req.query; // Get the selected currency from query parameters
  try {
    const itineraries = await Itinerary.find().populate({
      path: 'activities',
      populate: { path: 'category tags' }, // Populate nested fields if needed
    });
    if (currency) {
      const response = await axios.get('https://v6.exchangerate-api.com/v6/77676a6e9ec92dc31f556a19/latest/USD'); // Replace with your base currency
      const rates = response.data.conversion_rates;
      if (!rates[currency]) {
        return res.status(400).json({ error: `Currency code ${currency} not found in exchange rates.` });
      }
      const conversionRate = rates[currency];
      const convertedItineraries = itineraries.map((item) => {
        const convertedItem = item.toObject(); // Convert Mongoose document to plain JavaScript object
        convertedItem.price = (convertedItem.price * conversionRate).toFixed(2); // Convert price to selected currency
        return convertedItem;
      });
      return res.status(200).json(convertedItineraries);
    }
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

module.exports = {
  createItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  sortItineraries,
  searchItinerary,
  filterItinerairies,
  filterItinerariesByPref,
  getExchangeRates
};
