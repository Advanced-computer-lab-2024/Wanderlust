const axios = require("axios");
const hotelReservationsModel = require("../Models/hotelReservations");
const User = require("../Models/user");

const token = process.env.AMADEUS_API_KEY;
const searchHotels = async (req, res) => {
  const { cityCode } = req.query;
  try {
    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response || !response.data || response.data.length === 0) {
      return res.status(404).json({ message: "No hotels found" });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const bookHotel = async (req, res) => {
  const { userId, hotelId } = req.body;
  if (!userId || !hotelId) {
    return res.status(400).json({ message: "userId and hotelId are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-hotels?hotelIds=${hotelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Retrieve the first hotel object that matches the hotel ID
    const hotelData = response.data?.data?.find(
      (hotel) => hotel.hotelId === hotelId
    );
    if (!hotelData) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const hotelReservation = new hotelReservationsModel({
      userId: userId,
      hotelName: hotelData.name,
      hotelAddress: hotelData.address,
    });
    await hotelReservation.save();
    return res.status(200).json(hotelReservation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { searchHotels, bookHotel };
