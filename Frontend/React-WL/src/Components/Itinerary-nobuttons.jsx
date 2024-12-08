import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "lucide-react";
import Card from "../Components/Card";
import Activity from "./Activity";

const Itinerary = ({ guestMode }) => {
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
        const itineraryUrl =
          id === 1
            ? "http://localhost:8000/api/itinerary/getItineraryGuest"
            : `http://localhost:8000/api/itinerary/getItinerary?currency=${currency}`;

        // Fetch itineraries based on the URL
        const itineraryResponse = await axios.get(itineraryUrl, {
          headers:
            id !== 1
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

        // Update itinerary state with either filtered or fetched data
        setItinerary(itineraryData);
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
                  }}
                />
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
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
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
                className="border border-gray-300 p-2 w-80 rounded-lg"
              />
              <button
                onClick={searchItinerary}
                className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2.5 px-3 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            {itinerary.length > 0 ? (
              itinerary.map((item) => (
                <ItineraryItem key={item._id} item={item} />
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
};

const ItineraryItem = ({ item, onUpdate, onDelete }) => {
  const navigate = useNavigate();

  const handleBookItinerary = async () => {
    navigate("/BookingItineraryPage", {
      state: { itineraryId: item._id, price: item.price },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-600">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm flex items-center">
              <Calendar className="mr-2" size={16} />
              {item.timeline.start} - {item.timeline.end}
            </p>
          </div>
        </div>
        <ItineraryDetails item={item} />
        <ItineraryActivities activities={item.activities} />
        <ItinerarySection
          title="Locations"
          items={item.locations}
          icon={<MapPin size={18} />}
        />
        <ItinerarySection
          title="Available Dates"
          items={item.availableDates}
          icon={<Calendar size={18} />}
        />

        {/* Add Book Itinerary button here */}
        <button
          onClick={handleBookItinerary}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
        >
          Book Itinerary
        </button>
      </div>
    </div>
  );
};

const ItineraryDetails = ({ item }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
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
      icon={<Users size={18} />}
      label="Accessibility"
      value={item.accessibility}
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
    <DetailItem
      icon={<Check size={18} />}
      label="Booking Open"
      value={item.isActive ? "Yes" : "No"}
    />
    <DetailItem icon={<Star size={18} />} label="Rating" value={item.rating} />
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="text-indigo-500 mr-2">{icon}</div>
    <div>
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-600">{value}</span>
    </div>
  </div>
);

const ItineraryActivities = ({ activities }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-indigo-500 border-b border-indigo-100 pb-1 flex items-center">
      <Users className="mr-2" size={20} />
      Activities
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition duration-300"
        >
          <Activity
            activity={activity}
            showDeleteButton={false}
            showUpdateButton={false}
          />
        </div>
      ))}
    </div>
  </div>
);

const ItinerarySection = ({ title, items, icon }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2 text-indigo-500 border-b border-indigo-100 pb-1 flex items-center">
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
