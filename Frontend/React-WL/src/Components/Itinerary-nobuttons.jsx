import React, { useEffect, useState } from "react";
import axios from "axios";
import Activity from './Activity';
import MultiRangeSlider from "multi-range-slider-react";
import Activities from "./Activities";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Globe,
  DollarSign,
  Users,
  Check,
  Star,
  Search,
  Bookmark, BookmarkCheck 
} from "lucide-react";
import Card from "../Components/Card";
import Rating from "@mui/material/Rating"; // Ensure Rating component is imported

const Itinerary = ({ guestMode, showCreateButton = true, showUpdateButton = true, showDeleteButton = true, showBookButton = true, showBookmark = true, showBookButtonItinerary = true }) => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minValue, set_minValue] = useState(1);
  const [maxValue, set_maxValue] = useState(10000);
  const [touristId, settouristId] = useState(null);
  const [currency, setCurrency] = useState();

  useEffect(() => {
    const fetchCurrency = async () => {
      const userCurrency = await getTouristId().currency;
      setCurrency(userCurrency || "EGP"); // Default to 'EGP' if no currency is fetched
    };
    fetchCurrency();
  }, []);

  const getTouristId = async () => {
    try {
      const [infoResponse, userResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }),
        axios.get("http://localhost:8000/api/admin/getLoggedInUser", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }),
      ]);

      const combinedData = { ...infoResponse.data, ...userResponse.data };
      console.log(combinedData);
      return combinedData;
    } catch (error) {
      console.error("Error fetching tourist ID:", error);
      return 1; // Fallback ID for guest mode if API fails
    }
  };

  const fetchSavedItineraries = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:8000/api/itinerary/savedItineraries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedItineraries = response.data;
      const savedItineraryIds = savedItineraries.map(itinerary => itinerary._id);
      return savedItineraryIds;
    } catch (error) {
      console.error("Error fetching saved itineraries:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("guestMode:", guestMode);

        const user = await getTouristId();
        let id = 1; // Default to guest mode
        let currency = "EGP"; // Default currency if not found in user

        if (!guestMode) {
          id = user._id;
          currency = user.currency || currency;
          settouristId(id);
        } else {
          settouristId(id); // Set touristId to 1 in guest mode
        }

        // Define itinerary URL based on guestMode and currency
        const itineraryUrl = id === 1
          ? "http://localhost:8000/api/itinerary/getItineraryGuest"
          : `http://localhost:8000/api/itinerary/getItinerary?currency=${currency}`;

        // Fetch itineraries based on the URL
        const itineraryResponse = await axios.get(itineraryUrl, {
          headers: id !== 1
            ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
            : undefined,
        });

        let itineraryData = itineraryResponse.data;

        // Fetch bookings for the current tourist if not in guest mode
        if (!guestMode) {
          const userIdResponse = await axios.get(
            "http://localhost:8000/api/admin/getLoggedInInfo",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          const userIdValue = userIdResponse.data?._id;

          const bookingsResponse = await axios.get(
            "http://localhost:8000/api/bookings/getBooking",
            {
              params: { userId: userIdValue },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );

          const bookings = Array.isArray(bookingsResponse.data)
            ? bookingsResponse.data
            : [];
          const bookedItineraryIds = bookings.map(
            (booking) => booking.itineraryId?._id
          );

          // Filter itineraries based on bookings
          itineraryData = itineraryData.filter(
            (itinerary) => !bookedItineraryIds.includes(itinerary._id)
          );
        }

        const savedItineraryIds = await fetchSavedItineraries();
        const updatedItineraryData = itineraryData.map(itinerary => ({
          ...itinerary,
          isSaved: savedItineraryIds.includes(itinerary._id),
        }));
        setItinerary(updatedItineraryData);
      } catch (error) {
        console.error("Error fetching itineraries or bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [guestMode]);

  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  const onFilter = () => {
    var date = document.getElementById("date").value;
    var language = document.getElementById("language").value;
    filterItinerary({ language, date });
  };

  const onFilterPref = () => {
    var preference = document.getElementById("preferences").value;
    filterItineraryByPref({ preference });
  };
  const sortItinerary = async () => {
    try {
      const sortBy = document.getElementById("sortBy").value;
      const orderBy = document.getElementById("orderBy").value;
      const response = await axios.get(`http://localhost:8000/api/itinerary/sortItineraries?sortBy=${sortBy}&orderBy=${orderBy}`);
      const data = await response.data;
      if (Array.isArray(data) && data.length > 0) {
        setItinerary(data);
      } else {
        setItinerary(data);
        console.log("Itinerary array is empty or undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const filterItineraryByPref = async ({ preference }) => {
    try {
      if (preference === "All") {
        preference = "undefined";
      }
      let url = `http://localhost:8000/api/itinerary/filterItinerariesByPref?preference=${preference}`;
      const response = await axios.get(url);
      const data = await response.data;
      console.log(data);
      if (Array.isArray(data) && data.length > 0) {
        setItinerary(data);
      } else {
        setItinerary(data);
        console.log("Itinerary array is empty or undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const filterItinerary = async ({ language, date }) => {
    try {
      if (language === "All") {
        language = undefined;
      }
      if (date === "") {
        date = undefined;
      }
      let url = "http://localhost:8000/api/itinerary/filterItineraries?";
      if (minValue) url += `minBudget=${minValue}&`;
      if (maxValue) url += `maxBudget=${maxValue}&`;
      if (date) url += `date=${date}&`;
      if (language) url += `language=${language}&`;
      url =
        url.slice(-1) === "&" || url.slice(-1) === "?" ? url.slice(0, -1) : url;
      const response = await axios.get(url);
      const data = await response.data;
      console.log(data);
      if (Array.isArray(data) && data.length > 0) {
        setItinerary(data);
      } else {
        setItinerary(data);
        console.log("Itinerary array is empty or undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const searchItinerary = async () => {
    try {
      const query = document.getElementById("searchInput").value;
      const response = await axios.get(
        `http://localhost:8000/api/itinerary/searchItinerary?query=${query}`
      );
      const data = await response.data;
      if (Array.isArray(data) && data.length > 0) {
        setItinerary(data);
      } else {
        setItinerary(data);
        console.log("Itinerary array is empty or undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error.message}</span>
      </div>
    );

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container mx-auto flex flex-col lg:flex-row">
        <div className="bg-white rounded-xl shadow-md p-6 lg:w-1/3 mb-6 lg:mb-0 lg:mr-6 mt-10">
        <div className="mb-4">
            <label htmlFor="sortBy" className="text-gray-700 font-semibold mb-1 block">Sort by:</label>
            <select id="sortBy" className="border border-gray-300 p-2 rounded-lg w-full mb-2">
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
            <label htmlFor="orderBy" className="text-gray-700 font-semibold mb-1 block">Order:</label>
            <select id="orderBy" className="border border-gray-300 p-2 rounded-lg w-full mb-2">
              <option value="1">Ascending</option>
              <option value="-1">Descending</option>
            </select>
            <button
              onClick={sortItinerary}
              className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sort
            </button>
          </div>
          <div className="mb-4">
            <div className="Slider mb-6">
              <div className="sliderleft mb-4">
                <MultiRangeSlider
                  className="slider"
                  min={1}
                  max={1000}
                  step={10}
                  minValue={minValue}
                  maxValue={maxValue}
                  ruler={false}
                  barInnerColor="#4338ca"
                  onInput={(e) => {
                    handleInput(e);
                  } } />
              </div>
              <div className="slidertext flex justify-between">
                <p className="minValue text-gray-700">
                  Min Value:{" "}
                  <span className="text-custom font-semibold">${minValue}</span>
                </p>
                <p className="maxValue text-gray-700">
                  Max Value:{" "}
                  <span className="text-custom font-semibold">${maxValue}</span>
                </p>
              </div>
            </div>
            <div className="Datediv mb-4">
              <label
                htmlFor="date"
                className="text-gray-700 font-semibold mb-1 block"
              >
                Date:
              </label>
              <input
                id="date"
                type="date"
                className="border border-gray-300 p-2 rounded-lg w-full" />
            </div>
            <div className="Datediv mb-4">
              <label
                htmlFor="language"
                className="text-gray-700 font-semibold mb-1 block"
              >
                Language:
              </label>
              <select
                id="language"
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="All">All</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            <div className="filterButtonDiv mb-4">
              <button
                onClick={onFilter}
                className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Filter
              </button>
            </div>
            <div className="Datediv mb-4">
              <label
                htmlFor="preferences"
                className="text-gray-700 font-semibold mb-1 block"
              >
                Preferences:
              </label>
              <select
                id="preferences"
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="All">All</option>
                <option value="Beaches">Beaches</option>
                <option value="Family-Friendly">Family-Friendly</option>
                <option value="Budget-Friendly">Budget-Friendly</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            <div className="filterButtonDiv mb-4">
              <button
                onClick={onFilterPref}
                className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-custom mb-6 text-center">
            Browse Itineraries
          </h2>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <input
                type="text"
                id="searchInput"
                placeholder="Search for Itinerary..."
                className="border border-gray-300 p-2 w-80 rounded-lg" />
              <button
                onClick={searchItinerary}
                className="bg-custom hover:bg-blue-600 text-white font-semibold py-2.5 px-3 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            {itinerary.length > 0 ? (
              itinerary.map((item) => (
                <ItineraryItem 
                  key={item._id} 
                  item={item} 
                  showBookButton={showBookButton} 
                  showUpdateButton={showUpdateButton} 
                  showDeleteButton={showDeleteButton} 
                  showBookmark={showBookmark} 
                  showBookButtonItinerary={showBookButtonItinerary} // Added showBookButtonItinerary
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Globe className="mx-auto text-gray-400" size={64} />
                <p className="mt-4 text-xl text-gray-600">
                  No itineraries available. Create your first adventure!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const ItineraryItem = ({ item, showBookButton, showUpdateButton, showDeleteButton, showBookmark, showBookButtonItinerary, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(item.isSaved);
  const [loading, setLoading] = useState(false);

  const handleBookItinerary = async () => {
    navigate("/BookingItineraryPage", {
      state: { itineraryId: item._id, price: item.price },
    });
  };
  const handleSaveItinerary = async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/itinerary/saveItinerary',
        { itineraryId: item._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        setIsSaved(true);
        console.log('Itinerary saved successfully');
      } else {
        console.error('Failed to save itinerary');
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleUnsaveItinerary = async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/itinerary/unsaveItinerary',
        { itineraryId: item._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        setIsSaved(false);
        console.log('Itinerary unsaved successfully');
      } else {
        console.error('Failed to unsave itinerary');
      }
    } catch (error) {
      console.error('Error unsaving itinerary:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveUnsave = async () => {
    if (isSaved) {
      await handleUnsaveItinerary();
    } else {
      await handleSaveItinerary();
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-600">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm flex items-center">
              <Calendar className="mr-2" size={16} />
              {new Date(item.timeline.start).toLocaleDateString()} - {new Date(item.timeline.end).toLocaleDateString()}
            </p>
          </div>
        </div>
        <ItineraryDetails item={item} showBookingOpen={showBookButton} />
        <ItineraryActivities activities={item.activities} showUpdateButton={showUpdateButton} showDeleteButton={showDeleteButton} showBookButton={showBookButton} showBookmark={showBookmark} />
        <ItinerarySection
          title="Locations"
          items={item.locations}
          icon={<MapPin size={18} />}
        />
        <ItinerarySection
          title="Available Dates"
          items={item.availableDates.map(date => new Date(date).toLocaleDateString())}
          icon={<Calendar size={18} />}
        />

<div className="flex space-x-4 mt-4">
          {showBookButtonItinerary && (
            <button
              onClick={handleBookItinerary}
              className="bg-custom hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
            >
              Book Itinerary
            </button>
          )}
          {showBookmark && (
            <button
              onClick={handleSaveUnsave}
              className="bg-custom text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:bg-blue-600 flex items-center text-xs"
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
    
  );
};

const ItineraryDetails = (
  { item, showBookingOpen } // Added showBookingOpen
) => (
  <div className="text-custom grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
    <DetailItem
      icon={<DollarSign size={18} />}
      label="Price"
      value={item.price}
    />
    <DetailItem
      icon={<Globe size={18} />}
      label="Language of Tour"
      value={item.languageOfTour}
    />
    <DetailItem
      icon={<MapPin size={18} />}
      label="Pickup Location"
      value={item.pickupLocation}
    />
    <DetailItem
      icon={<MapPin size={18} />}
      label="Dropoff Location"
      value={item.dropoffLocation}
    />
    {showBookingOpen && (
      <DetailItem
        icon={<Check size={18} />}
        label="Booking Open"
        value={item.isActive ? "Yes" : "No"}
      />
    )}{" "}
    {/* Conditionally render */}
    <div className="flex items-center">
      <DetailItem
        icon={<Star size={18} />}
        label="Rating"
        value={item.rating}
      />
      <Rating
        name="read-only"
        value={item.rating}
        readOnly
        sx={{ color: "gold", fontSize: "1.5rem", marginLeft: "0.5rem" }}
      />
    </div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="text-blue-600 mr-2">{icon}</div>
    <div>
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-600">{value}</span>
    </div>
  </div>
);

const ItineraryActivities = ({ activities, showUpdateButton, showDeleteButton, showBookButton, showBookmark }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b border-indigo-100 pb-1 flex items-center">
      <Users className="mr-2" size={20} />
      Activities
    </h3>
    <div className="flex flex-col gap-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition duration-300"
        >
          <Activity
            activity={activity}
            showDeleteButton={showDeleteButton}
            showUpdateButton={showUpdateButton}
            showBookButton={showBookButton}
            showBookmark={showBookmark}
          />
        </div>
      ))}
    </div>
  </div>
);

const ItinerarySection = ({ title, items, icon }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2 text-blue-600 border-b border-indigo-100 pb-1 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <ul className="list-disc list-inside pl-4">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600 text-sm mb-1">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Itinerary;
