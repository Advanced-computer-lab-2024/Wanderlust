const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe Secret Key
const Itinerary = require("../Models/Itinerary");
const Activity = require("../Models/Activity");
const PreferenceTagModel = require("../Models/PreferenceTag");
const Booking = require("../Models/Booking");
const User = require("../Models/user");
const touristModel = require("../Models/Tourist"); // Add this line to import touristModel
const jwt = require("jsonwebtoken");

const { getExchangeRates, convertCurrency } = require("./currencyConverter");

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
    isActive,
  } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const creatorId = decodedToken.id;
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
      isActive,
      creator: creatorId,
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
//edited
const getItinerary = async (req, res) => {
  const { currency } = req.query; // Get the selected currency from query parameters
  try {
    const itineraries = await Itinerary.find({
      flagged: false,
      isActive: true,
    }).populate({
      path: "activities",
      populate: { path: "category tags" },
    });

    if (currency) {
      const convertedItineraries = await Promise.all(
        itineraries.map(async (item) => {
          const convertedItem = item.toObject(); // Convert Mongoose document to plain JavaScript object
          convertedItem.price = await convertCurrency(
            convertedItem.price,
            currency
          ); // Convert itinerary price to selected currency

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

const getItineraryGuest = async (req, res) => {
  try {
    const itinerary = await Itinerary.find().populate({
      path: "activities",
      populate: { path: "category tags" }, // Populate nested fields if needed
    });
    res.status(200).json(itinerary);
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
    isActive,
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
        isActive,
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
      query.availableDates = { $in: new Date(date) };
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

    if (preference === "undefined") {
      console.log("No preference tag provided");
      const itineraries = await Itinerary.find().populate({
        path: "activities",
        populate: { path: "category tags" },
      });
      return res.status(200).json(itineraries);
    }
    const tag = await PreferenceTagModel.findOne({ name: preference });
    if (!tag) {
      return res.status(404).json({ message: "Preference tag not found" });
    }
    const activities = await Activity.find({ tags: tag._id });

    const itineraries = await Itinerary.find({
      activities: { $in: activities.map((a) => a._id) },
    }).populate({
      path: "activities",
      populate: {
        path: "tags",
        model: "PreferenceTag",
      },
    });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const bookItinerary = async (req, res) => {
  try {
    const { itineraryId, paymentMethod, userId } = req.body;

    const tourist = await touristModel.findOne({ userId: userId });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const oldbooking = await Booking.findOne({
      userId: tourist.userId,
      itineraryId,
    });
    if (oldbooking) {
      return res
        .status(400)
        .json({ message: "User has already booked this itinerary" });
    }
    let booking = new Booking({ userId: tourist.userId, itineraryId });

    if (paymentMethod === "wallet") {
      // Wallet payment
      if (tourist.wallet < itinerary.price) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Deduct from wallet and update booking
      tourist.wallet -= itinerary.price;
      await tourist.save();
      await booking.save();
      return res.json({ message: "Payment successful using wallet" });
    } else if (paymentMethod === "card") {
      // Stripe payment
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: itinerary.price * 100, // Convert to cents
          currency: tourist.currency,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
          },
        });
        await booking.save();
        return res.json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Payment processing failed", error: error.message });
      }
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Error booking itinerary:", error);
    res.status(500).json({ message: error.message });
  }
};

const cancelItineraryBooking = async (req, res) => {
  const { bookingId } = req.params; // Get the booking ID from the request params

  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const itinerary = await Itinerary.findById(booking.itineraryId);

    // Check if the itinerary start time is more than 48 hours away
    const currentTime = new Date();
    const itineraryTime = new Date(itinerary.timeline.start); // Assume you have an itineraryStartTime field

    const timeDifference = itineraryTime - currentTime; // in milliseconds
    const hoursDifference = timeDifference / (1000 * 60 * 60); // convert to hours
    // console.log("Current time", currentTime);
    // console.log("Itinerary time", itineraryTime);
    // console.log("hoursDifference", hoursDifference);

    if (hoursDifference < 48) {
      console.log("here");
      return res.status(400).json({
        message: `Cannot cancel booking less than 48 hours before the itinerary, hoursDifference=${hoursDifference}`,
      });
    }
    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    tourist.wallet += itinerary.price;
    await tourist.save();

    // If it's more than 48 hours, proceed to cancel the booking
    await Booking.deleteOne({ _id: bookingId });
    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Check if there are bookings associated with this itinerary
    const hasBookings = itinerary.bookings && itinerary.bookings.length > 0;

    // If there are bookings, toggle the active status
    if (hasBookings) {
      itinerary.isActive = !itinerary.isActive; // Toggle active status
      await itinerary.save(); // Save the updated itinerary
      return res.status(200).json({
        message: `Itinerary has been ${
          itinerary.isActive ? "activated" : "deactivated"
        }.`,
      });
    } else {
      // If there are no bookings, return an error
      return res.status(400).json({
        message: "Itinerary cannot be deactivated because it has no bookings.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating itinerary." });
  }
};

const generateShareLink = async (req, res) => {
  try {
    const { itineraryId } = req.params;
    if (!itineraryId) {
      return res.status(400).json({ message: "Itinerary ID is required" });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const shareLink = `${req.protocol}://${req.get(
      "host"
    )}/itineraries/${itineraryId}/share`;
    return res.status(200).json({ shareLink });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error generating share link" });
  }
};

// Flag an itinerary as inappropriate (admin only)
const flagItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itinerary.flagged = true;
    await itinerary.save();
    res
      .status(200)
      .json({ message: "Itinerary flagged successfully", itinerary });
  } catch (error) {
    console.error("Error flagging itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unflag an itinerary as inappropriate (admin only)
const unflagItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itinerary.flagged = false;
    await itinerary.save();
    res
      .status(200)
      .json({ message: "Itinerary unflagged successfully", itinerary });
  } catch (error) {
    console.error("Error unflagging itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tourist rate an itinerary they followed
const rateItinerary = async (req, res) => {
  try {
    const { itineraryId, rating, review } = req.body;
    if (!itineraryId || !rating) {
      return res
        .status(400)
        .json({ message: "Itinerary ID and rating are required" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const existingRating = itinerary.ratings.find(
      (r) => r.userId.toString() === userId
    );
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      itinerary.ratings.push({ userId, rating, review });
    }

    await itinerary.save();
    res.status(200).json({ message: "Rating added successfully", itinerary });
  } catch (error) {
    console.error("Error rating itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createItinerary,
  getItinerary,
  getItineraryGuest,
  updateItinerary,
  deleteItinerary,
  sortItineraries,
  searchItinerary,
  filterItinerairies,
  filterItinerariesByPref,
  bookItinerary,
  cancelItineraryBooking,
  addComment,
  activateDeactivateItinerary,
  generateShareLink,
  flagItinerary,
  unflagItinerary,
  rateItinerary,
};
