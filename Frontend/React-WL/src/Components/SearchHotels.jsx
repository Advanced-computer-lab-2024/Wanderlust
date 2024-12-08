import React, { useState } from "react";
import axios from "axios";

const SearchHotels = () => {
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSearch = async () => {
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
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between space-x-4">
        {/* Destination */}
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-gray-600">
            <i className="fas fa-search"></i>
          </span>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Destination</label>
            <input
              type="text"
              placeholder="Enter a destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-gray-600">
            <i className="fas fa-calendar-alt"></i>
          </span>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Check in</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-gray-600">
            <i className="fas fa-calendar-alt"></i>
          </span>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Check out</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-gray-600">
            <i className="fas fa-user"></i>
          </span>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            >
              {[...Array(10).keys()].map((n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1} Guest{n > 0 && "s"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

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
                className="p-4 border rounded shadow-md hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
                <p className="text-sm text-gray-600">
                  Check-in: {hotel.checkInDate} | Check-out:{" "}
                  {hotel.checkOutDate}
                </p>
                <p className="text-sm text-gray-600">
                  Guests: {hotel.guests} | Rooms: {hotel.numberOfRooms}
                </p>
                <p className="text-sm text-gray-600">
                  Price: {hotel.priceTotal} {hotel.currency}
                </p>
                <p className="text-sm text-gray-600">
                  City Code: {hotel.cityCode} | Available:{" "}
                  {hotel.availability ? "Yes" : "No"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchHotels;
