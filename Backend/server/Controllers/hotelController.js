const axios = require("axios");
const hotelReservationsModel = require("../Models/hotelReservations");
const touristModel = require("../Models/Tourist");
const jwt = require("jsonwebtoken");

// const token = process.env.AMADEUS_API_KEY;

let accessToken = null;
let tokenExpiry = null;

const generateAccessToken = async () => {
  if (accessToken && tokenExpiry > Date.now()) {
    // Return cached token if still valid
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

    // Cache the token and expiry time
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    return accessToken;
  } catch (error) {
    console.error("Failed to generate Amadeus access token:", error.message);
    throw new Error("Unable to generate Amadeus access token");
  }
};

const searchHotels = async (req, res) => {
  const { destination, checkInDate, checkOutDate, guests } = req.query;

  if (!destination || !checkInDate || !checkOutDate || !guests) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const cityCode = await getCityCode(destination);
    if (!cityCode) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const offers = await getHotelOffers(
      cityCode,
      checkInDate,
      checkOutDate,
      guests
    );

    if (offers.length === 0) {
      return res.status(404).json({ message: "No hotels found" });
    }

    // Format the response with all offers for each hotel
    const formattedOffers = offers.flatMap((offer) => {
      const hotel = offer.hotel;
      if (!offer.offers || !offer.offers.length) {
        console.warn(`No offers available for hotel: ${hotel.name}`);
        return [];
      }

      return offer.offers.map((singleOffer) => ({
        hotelName: hotel.name || "N/A",
        checkInDate: singleOffer.checkInDate || "N/A",
        checkOutDate: singleOffer.checkOutDate || "N/A",
        guests: singleOffer.guests?.adults || 0,
        priceTotal: singleOffer.price?.total || "N/A",
        currency: singleOffer.price?.currency || "N/A",
        cityCode: hotel.cityCode || "N/A",
        numberOfRooms: singleOffer.room?.typeEstimated?.beds || "N/A",
        availability: offer.available || false,
        offerId: singleOffer.id || "N/A", // Include the offerId
      }));
    });

    return res.status(200).json(formattedOffers);
  } catch (error) {
    console.error("Error in searchHotels:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getCityCode = async (destination) => {
  const token = await generateAccessToken();
  try {
    const locationResponse = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${destination}&subType=CITY`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!locationResponse?.data?.data?.length) {
      return null;
    }

    return locationResponse.data.data[0].iataCode;
  } catch (error) {
    console.error("Error in getCityCode:", error.message);
    return null;
  }
};

const validateDates = (checkInDate, checkOutDate) => {
  const today = new Date();
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn < today) {
    throw new Error("Check-in date cannot be in the past.");
  }

  if (checkOut <= checkIn) {
    throw new Error("Check-out date must be after check-in date.");
  }

  if ((checkOut - checkIn) / (1000 * 60 * 60 * 24) > 30) {
    throw new Error(
      "Booking period exceeds the maximum allowable range (30 days)."
    );
  }
};

const getHotelOffers = async (cityCode, checkInDate, checkOutDate, guests) => {
  const token = await generateAccessToken();

  // Validate the date ranges before proceeding
  try {
    validateDates(checkInDate, checkOutDate);
  } catch (dateError) {
    console.error("Date validation error:", dateError.message);
    throw dateError;
  }

  try {
    const hotelListResponse = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!hotelListResponse?.data?.data?.length) {
      console.warn("No hotels found for the provided cityCode.");
      return [];
    }

    // Extract hotelIds
    const hotelIds = hotelListResponse.data.data.map((hotel) => hotel.hotelId);

    // Track invalid property codes
    const invalidHotelIds = new Set();

    // Chunk hotelIds into smaller batches
    const chunkSize = 20; // Adjust based on API constraints
    const chunks = [];
    for (let i = 0; i < hotelIds.length; i += chunkSize) {
      chunks.push(hotelIds.slice(i, i + chunkSize));
    }

    // Process chunks sequentially
    const offersArray = [];
    for (const chunk of chunks) {
      // Filter out invalid hotelIds
      const validChunk = chunk.filter((id) => !invalidHotelIds.has(id));
      if (validChunk.length === 0) continue;

      try {
        const response = await axios.get(
          `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${validChunk.join(
            ","
          )}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${guests}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        offersArray.push(...(response.data.data || []));
      } catch (error) {
        console.error(
          "Error fetching offers for chunk:",
          error.response?.data || error.message
        );

        // Handle specific errors and track invalid hotelIds
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((err) => {
            if (
              err.code === 1257 &&
              err.detail.includes("INVALID PROPERTY CODE")
            ) {
              validChunk.forEach((id) => invalidHotelIds.add(id));
              console.warn(`Invalid hotelIds: ${validChunk.join(",")}`);
            }
          });
        }
      }
    }

    return offersArray;
  } catch (error) {
    console.error(
      "Error in getHotelOffers:",
      error.response?.data || error.message
    );
    return [];
  }
};

const bookHotel = async (req, res) => {
  const { offerId } = req.body;

  if (!offerId) {
    return res.status(400).json({ message: "Offer ID is required" });
  }

  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const apiToken = await generateAccessToken();
    const response = await axios.get(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers/${offerId}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    const offerData = response.data?.data;

    if (!offerData) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Construct the reservation object with all required details
    const hotelReservation = new hotelReservationsModel({
      userId: tourist.userId,
      hotelName: offerData.hotel.name || "N/A",
      hotelAddress: offerData.hotel.address || "N/A",
      checkInDate: offerData.checkInDate || "N/A",
      checkOutDate: offerData.checkOutDate || "N/A",
      totalPrice: offerData.price?.total || "N/A",
      currency: offerData.price?.currency || "N/A",
      roomType: offerData.room?.description?.text || "N/A",
      guests: offerData.guests?.adults || 0,
      cancellationPolicy: offerData.policies?.cancellations || [],
    });

    await hotelReservation.save();

    return res.status(200).json({
      message: "Hotel booked successfully",
      reservation: hotelReservation,
    });
  } catch (error) {
    console.error("Error booking hotel:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { searchHotels, bookHotel };
