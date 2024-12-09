import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const SearchHotels = () => {
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!destination || !checkInDate || !checkOutDate || !guests) {
      setError("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/hotel/searchHotels",
        {
          params: {
            destination,
            checkInDate,
            checkOutDate,
            guests,
          },
        }
      );
      setHotels(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching hotels");
    } finally {
      setLoading(false);
    }
  };
  const handleBookHotel = async (hotel) => {
    try {
      const {
        hotelName,
        checkInDate,
        checkOutDate,
        priceTotal,
        currency,
        guests,
        cityCode,
        numberOfRooms,
        availability,
        offerId,
      } = hotel;

      // Send all the necessary data to the backend
      const response = await axios.post(
        "http://localhost:8000/api/hotel/bookHotel",
        {
          hotelName,
          checkInDate,
          checkOutDate,
          priceTotal,
          currency,
          guests,
          cityCode,
          numberOfRooms,
          availability,
          offerId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      alert("Hotel booked successfully!");
    } catch (error) {
      console.error(
        "Error booking hotel:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to book hotel. Please try again."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-custom mb-6 text-center">
        Search Hotels
      </h2>

      <div className="mb-6 flex items-center space-x-4">
        {/* Destination */}
        <div className="flex items-center flex-1">
          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>

        {/* Check-in Date */}
        <div className="flex items-center flex-1">
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>

        {/* Check-out Date */}
        <div className="flex items-center flex-1">
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>

        {/* Guests */}
        <div className="flex items-center flex-1">
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          >
            {[...Array(10).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>
                {n + 1} Guest{n > 0 && "s"}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2.5 px-3 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Hotel Results */}
      {hotels.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Available Hotels
          </h2>
          <ul className="space-y-4">
            {hotels.map((hotel, index) => (
              <li
                key={index}
                className="p-4 border rounded shadow-md hover:shadow-lg relative"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-bold">{hotel.hotelName}</h3>
                </div>
                <p className="text-gray-500 text-sm">
                  Check-in: {hotel.checkInDate} | Check-out:{" "}
                  {hotel.checkOutDate}
                </p>
                <p className="text-gray-500 text-sm">
                  Guests: {hotel.guests} | Rooms: {hotel.numberOfRooms}
                </p>
                <p className="text-gray-500 text-sm">
                  Price: {hotel.priceTotal} {hotel.currency}
                </p>
                <p className="text-gray-500 text-sm">
                  City Code: {hotel.cityCode} | Available:{" "}
                  {hotel.availability ? "Yes" : "No"}
                </p>
                <button
                  onClick={() => handleBookHotel(hotel)}
                  className="bg-custom text-white px-2 py-1 rounded-md text-xs mt-2 transition duration-300 ease-in-out transform hover:bg-blue-600"
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchHotels;
