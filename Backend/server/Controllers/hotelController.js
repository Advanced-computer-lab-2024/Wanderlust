const axios = require("axios");
const hotelReservationsModel = require("../Models/hotelReservations");
const User = require("../Models/user");

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

    return res.status(200).json(offers);
  } catch (error) {
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

    if (locationResponse?.data?.data?.length === 0) {
      return null;
    }

    return locationResponse.data.data[0].iataCode;
  } catch (error) {
    console.log(error);
  }
};

const getHotelOffers = async (cityCode, checkInDate, checkOutDate, guests) => {
  const token = await generateAccessToken();

  const hotelListResponse = await axios.get(
    `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (hotelListResponse?.data?.data?.length === 0) {
    return [];
  }

  // Extract hotelIds
  const hotelIds = hotelListResponse.data.data.map((hotel) => hotel.hotelId);

  // Fetch offers concurrently
  const offerPromises = hotelIds.map((hotelId) =>
    axios
      .get(
        `https://test.api.amadeus.com/v2/shopping/hotel-offers?hotelId=${hotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${guests}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => response.data.data || []) // Return the offers or an empty array if none
      .catch((error) => {
        console.error(
          `Error fetching offers for hotelId ${hotelId}:`,
          error.message
        );
        return []; // Handle errors gracefully
      })
  );

  // Wait for all promises to resolve
  const offersArray = await Promise.all(offerPromises);

  // Flatten the array of arrays
  return offersArray.flat();
};

const bookHotel = async (req, res) => {
  const { offerId } = req.body;
  if (!offerId) {
    return res.status(400).json({ message: "offerId are required" });
  }
  const token = await generateAccessToken();

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

    const response = await axios.get(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers/${offerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Retrieve the first hotel object that matches the hotel ID
    const offerData = response.data?.data?.hotel;

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
