import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const SearchFlights = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate || !adults) {
      setError("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/flight/searchFlights",
        {
          params: {
            origin,
            destination,
            departureDate,
            returnDate,
            adults,
          },
        }
      );
      setFlights(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching flights");
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = async (flight) => {
    try {
      const {
        airline,
        origin,
        destination,
        departureDate,
        returnDate,
        price,
        currency,
        adults,
        flightId,
      } = flight;

      const response = await axios.post(
        "http://localhost:8000/api/flight/bookFlight",
        {
          airline,
          origin,
          destination,
          departureDate,
          returnDate,
          price,
          currency,
          adults,
          flightId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      alert("Flight booked successfully!");
    } catch (error) {
      console.error("Error booking flight:", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "Failed to book flight. Please try again."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-custom mb-6 text-center">
        Search Flights
      </h2>

      <div className="mb-6 flex items-center space-x-4">
        {/* Origin */}
        <div className="flex items-center flex-1">
          <input
            type="text"
            placeholder="Origin (City Code)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>

        {/* Destination */}
        <div className="flex items-center flex-1">
          <input
            type="text"
            placeholder="Destination (City Code)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>

        {/* Departure Date */}
        <div className="flex items-center flex-1">
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>

        {/* Return Date */}
        <div className="flex items-center flex-1">
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
          />
        </div>

        {/* Adults */}
        <div className="flex items-center flex-1">
          <select
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          >
            {[...Array(10).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>
                {n + 1} Adult{n > 0 && "s"}
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

      {/* Flight Results */}
      {flights.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Available Flights
          </h2>
          <ul className="space-y-4">
            {flights.map((flight, index) => (
              <li
                key={index}
                className="p-4 border rounded shadow-md hover:shadow-lg relative"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-bold">{flight.airline}</h3>
                </div>
                <p className="text-gray-500 text-sm">
                  Origin: {flight.origin} | Destination: {flight.destination}
                </p>
                <p className="text-gray-500 text-sm">
                  Departure: {flight.departureDate} | Return: {flight.returnDate || "N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  Price: {flight.price} {flight.currency}
                </p>
                <p className="text-gray-500 text-sm">
                  Adults: {flight.adults} | Flight ID: {flight.flightId}
                </p>
                <button
                  onClick={() => handleBookFlight(flight)}
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

export default SearchFlights;
