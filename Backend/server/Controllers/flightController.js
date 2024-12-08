const axios = require("axios");
const flightReservationsModel = require("../Models/flightReservations");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

let accessToken = null;
let tokenExpiry = null;

const generateAccessToken = async () => {
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error("Failed to generate Amadeus access token:", error.message);
    throw new Error("Unable to generate Amadeus access token");
  }
};

const searchFlightOffers = async (req, res) => {
  const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults } = req.body;

  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const token = await generateAccessToken();

    const response = await axios.post(
      `https://test.api.amadeus.com/v2/shopping/flight-offers`,
      {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        ...(returnDate && { returnDate }), // Optional
        adults,
        currencyCode: "USD", // Adjust as needed
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in searchFlightOffers:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const priceFlightOffer = async (req, res) => {
  const { flightOffer } = req.body;

  if (!flightOffer) {
    return res.status(400).json({ message: "Flight offer is required" });
  }

  try {
    const token = await generateAccessToken();

    const response = await axios.post(
      `https://test.api.amadeus.com/v1/shopping/flight-offers/pricing`,
      { data: flightOffer },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in priceFlightOffer:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createFlightOrder = async (req, res) => {
  const { flightOffer } = req.body;

  if (!flightOffer) {
    return res.status(400).json({ message: "Flight offer is required for booking" });
  }

  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const amadeusToken = await generateAccessToken();

    const response = await axios.post(
      `https://test.api.amadeus.com/v1/booking/flight-orders`,
      { data: { flightOffers: [flightOffer] } },
      {
        headers: {
          Authorization: `Bearer ${amadeusToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const bookingData = response.data;
    const flightReservation = new flightReservationsModel({
      userId: user._id,
      bookingId: bookingData.id,
      flightOffer,
    });

    await flightReservation.save();

    return res.status(200).json(flightReservation);
  } catch (error) {
    console.error("Error in createFlightOrder:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { searchFlightOffers, priceFlightOffer, createFlightOrder };
