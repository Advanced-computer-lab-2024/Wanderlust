import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import axios from 'axios';
import Activities from './Activity-nobuttons';
import MultiRangeSlider from "multi-range-slider-react";
import { Calendar, MapPin, Globe, DollarSign, Users, Check, Star } from 'lucide-react';

const Itinerary = () => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minValue, set_minValue] = useState(1);
  const [maxValue, set_maxValue] = useState(10000);
    useEffect(() => {
      fetchItinerary();
    }, []);
  
  



  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };
  const onFilter = () => {
      var date = document.getElementById("date").value;
      var language = document.getElementById("language").value;
      console.log(minValue);
      console.log(maxValue);
      console.log(date);
      console.log(language);
      filterItinerary({language  , date});
  }
  const onFilterPref = () => {
    var preference = document.getElementById("preferences").value;
    filterItineraryByPref({preference});
}
  const filterItineraryByPref = async ({ preference }) => {
    try {
      if(preference === 'All'){
        preference='undefined';
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
  }
      



   const filterItinerary = async ({ language, date }) => {
    try {
      if(language === 'All'){
        language=undefined;
      }
      if(date === ''){
        date=undefined;
      }
      let url = "http://localhost:8000/api/itinerary/filterItineraries?";
      if (minValue) url += `minBudget=${minValue}&`;
      if (maxValue) url += `maxBudget=${maxValue}&`;
      if (date) url += `date=${date}&`;
      if (language) url += `language=${language}&`;
      url =
        url.slice(-1) === "&" || url.slice(-1) === "?"
          ? url.slice(0, -1)
          : url;
      console.log(url);
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
  }

  const searchItinerary = async () => {
    try {
      const query = document.getElementById("searchInput").value;
      const response = await axios.get(`http://localhost:8000/api/itinerary/searchItinerary?query=${query}`);
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
  const fetchItinerary = async () => {
    try {
      // Step 1: Fetch the logged-in user's bookings (similar to fetchBookings in activities)
      const fetchBookings = async () => {
        try {
          // Get the logged-in tourist's ID
          const userId = async () => {
            try {
              const response = await axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
              });
              return response.data;  // Assuming response.data contains the user ID
            } catch (error) {
              console.error("Error fetching user info:", error);
              return null;
            }
          };
  
          const userIdValue = await userId();
  
          // Fetch bookings for the current tourist
          const response = await axios.get("http://localhost:8000/api/bookings/getBooking", {
            params: {
              userId: userIdValue,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          });
  
          if (Array.isArray(response.data)) {
            return response.data;  // Return bookings array
          } else {
            return [];  // Return empty array if no valid bookings are found
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
          return [];
        }
      };
  
      // Step 2: Get the user's bookings and extract the booked itinerary IDs
      const bookings = await fetchBookings();
      const bookedItineraryIds = bookings.map((booking) => booking.itineraryId?._id);
  
      // Step 3: Fetch all itineraries from the API
      const response = await fetch('http://localhost:8000/api/itinerary/getitinerary');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      // Step 4: Filter out itineraries that have already been booked
      const filteredItineraries = data.filter(
        (itinerary) => !bookedItineraryIds.includes(itinerary._id)
      );
  
      // Step 5: Update the state with the filtered itineraries
      if (Array.isArray(filteredItineraries) && filteredItineraries.length > 0) {
        setItinerary(filteredItineraries);
      } else {
        console.log("Itinerary array is empty or all itineraries are booked.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreate = () => {
    console.log("Create new itinerary");
  };

  const handleUpdate = (id) => {
    console.log("Update itinerary with id:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete itinerary with id:", id);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error.message}</span>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div className="bg-white rounded-xl shadow-md p-3 md:w-1/3">
        <div className="mb-2">
          <div className="Slider">
            <div className="sliderleft">
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
            <div className="slidertext">
              <p className="minValue">
                Min Value:<span className="text-indigo-500 text-base font-semibold mb-1"> ${minValue}</span>
              </p>
              <p className="maxValue">
                Max Value: <span className="text-indigo-500 text-base font-semibold mb-1">${maxValue}</span>
              </p>
            </div>
          </div>
          <div className="Datediv">
            <p id="filtertext" className="text-base font-semibold mb-1">Date:</p>
            <input id="date" type="date" className="border border-gray-300 p-2 rounded-lg w-full" />
          </div>
          <div className="Datediv">
            <p id="filtertext" className="text-base font-semibold mb-1">Language:</p>
            <select id="language" className="border border-gray-300 p-2 rounded-lg w-full">
              <option value="All">All</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div className="filterButtonDiv mt-4">
            <button
              onClick={onFilter}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
            >
              Filter
            </button>
          </div>
          <div className="Datediv mt-4">
            <p id="filtertext" className="text-base font-semibold mb-1">Preferences:</p>
            <select id="preferences" className="border border-gray-300 p-2 rounded-lg w-full">
              <option value="All">All</option>
              <option value="Beaches">Beaches</option>
              <option value="Family-Friendly">Family-Friendly</option>
              <option value="Budget-Friendly">Budget-Friendly</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>
          <div className="filterButtonDiv mt-4">
            <button
              onClick={onFilterPref}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
            >
              Filter
            </button>
          </div>
          <div className="mt-4">
            <input
              type="text"
              id="searchInput"
              placeholder="Search for Itinerary..."
              className="border border-gray-300 p-2 rounded-lg w-full"
            />
            <button
              onClick={searchItinerary}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full mt-2 shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 min-h-screen py-8 md:w-2/3">
        <div className="max-w-6xl mx-auto px-4">
          <Card>
            <div className="itinerary-container">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-indigo-700">Itineraries</h1>
               
              </div>
              {itinerary.length > 0 ? (
                itinerary.map((item) => (
                  <ItineraryItem
                    key={item._id}
                    item={item}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <Globe className="mx-auto text-gray-400" size={64} />
                  <p className="mt-4 text-xl text-gray-600">No itineraries available. Create your first adventure!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ItineraryItem = ({ item, onUpdate, onDelete }) => {
  const handleBookItinerary = async () => {
    try {

      const userId = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          });
          console.log(response.data);
          return response.data; // Assuming response.data contains the user ID
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      
      const userIdValue = await userId();


      const response = await axios.post("http://localhost:8000/api/itinerary/bookItinerary", {
        itineraryId: item._id,
        userId: userIdValue,
      });

      if (response.status === 201) {
        alert("Booking successful!");
      }
    } catch (error) {
      console.error("Error booking itinerary:", error);
      alert("Error booking itinerary");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-600">{item.title}</h2>
            <p className="text-gray-600 text-sm flex items-center">
              <Calendar className="mr-2" size={16} />
              {item.timeline.start} - {item.timeline.end}
            </p>
          </div>
        </div>
        <ItineraryDetails item={item} />
        <ItineraryActivities activities={item.activities} />
        <ItinerarySection title="Locations" items={item.locations} icon={<MapPin size={18} />} />
        <ItinerarySection title="Available Dates" items={item.availableDates} icon={<Calendar size={18} />} />
        
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
    <DetailItem icon={<DollarSign size={18} />} label="Price" value={item.price} />
    <DetailItem icon={<Globe size={18} />} label="Language of Tour" value={item.languageOfTour} />
    <DetailItem icon={<Users size={18} />} label="Accessibility" value={item.accessibility} />
    <DetailItem icon={<MapPin size={18} />} label="Pickup Location" value={item.pickupLocation} />
    <DetailItem icon={<MapPin size={18} />} label="Dropoff Location" value={item.dropoffLocation} />
    <DetailItem icon={<Check size={18} />} label="Booking Open" value={item.bookingOpen ? "Yes" : "No"} />
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
        <div key={activity.id} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition duration-300">
          <Activities activity={activity} />
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