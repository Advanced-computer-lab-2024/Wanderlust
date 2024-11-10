const Booking = require("../Models/Booking");

const fetchBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    // Build the initial query object (only filtering by userId)
    const query = {};
    if (userId) {
      query.userId = userId;
    }

    // Fetch all bookings based on the userId (if provided)
    const bookings = await Booking.find(query)
      .populate("activityId") // Populate related activity data (if present)
      .populate("userId", "name email") // Populate user data (e.g., name and email)
      .populate("itineraryId") // Populate related itinerary data (if present)
      .exec();

    // Filter bookings: skip those that have neither an activityId nor itineraryId
    const validBookings = bookings.filter(
      (booking) => booking.activityId || booking.itineraryId
    );

    if (validBookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No valid bookings found for the given criteria." });
    }

    // Return the valid bookings
    res.status(200).json(validBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error, could not fetch bookings." });
  }
};

module.exports = {fetchBookings};
