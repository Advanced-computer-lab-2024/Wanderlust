import { useState, useEffect } from 'react';
import Activity from './Activity-nobuttons';
import MultiRangeSlider from "multi-range-slider-react";
import axios from 'axios';
const Activities = ({ showCreateButton = true, showUpdateButton = true, showDeleteButton = true, onCreate }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minValue, set_minValue] = useState(1);
  const [maxValue, set_maxValue] = useState(1000);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Step 1: Fetch the logged-in user's bookings
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
    
        // Step 2: Get the user's bookings and extract the booked activity IDs
        const bookings = await fetchBookings();
        const bookedActivityIds = bookings.map((booking) => booking.activityId?._id);
    
        // Step 3: Fetch all activities from the API
        const res = await fetch('http://localhost:8000/api/activity/getActivity');
        const data = await res.json();
    
        // Step 4: Filter out activities that have already been booked
        const filteredActivities = data.filter(
          (activity) => !bookedActivityIds.includes(activity._id)
        );
    
        // Step 5: Update the state with the filtered activities
        setActivities(filteredActivities);
      } catch (error) {
        console.log('Error fetching activities', error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchActivities();
  }, []);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };
  
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  const sortActivity = async () => {
    try {
      const sortBy = document.getElementById("sortBy").value;
      const orderBy = document.getElementById("orderBy").value;
      const response = await axios.get(`http://localhost:8000/api/activity/sortActivities?sortBy=${sortBy}&orderBy=${orderBy}`);
      const data = await response.data;
      if (Array.isArray(data) && data.length > 0) {
        setActivities(data);
      } else {
        setActivities(data);
        console.log("Activity array is empty or undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const filterActivity = async () =>{
    try{
      var date = document.getElementById("date").value;
      var category = document.getElementById("category").value;
      var rating = document.getElementById("rating").value;
      console.log(minValue,maxValue,date,category,rating);
      if(category === 'All'){
        category=undefined;
      }
      if(date === ''){
        date=undefined;
      }
      if(rating === 'All'){
        rating=undefined;
      }
      var url = `http://localhost:8000/api/activity/filterActivities?`;
      if (minValue) url += `minBudget=${minValue}&`;
      if (maxValue) url += `maxBudget=${maxValue}&`;
      if (date) url += `date=${date}&`;
      if (category) url += `category=${category}&`;
      if (rating) url += `ratings=${rating}&`;
      url =
        url.slice(-1) === "&" || url.slice(-1) === "?"
          ? url.slice(0, -1)
          : url;
      const response = await axios.get(url);
      const data = await response.data;
      console.log(data);
      if (Array.isArray(data) && data.length > 0) {
        setActivities(data);
      } else {
        setActivities(data);
        console.log("Activity array is empty or undefined.");
      }
    
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
  const searchActivity = async () => {
    try {
      const query = document.getElementById("searchInput").value;
      const response = await axios.get(`http://localhost:8000/api/activity/searchActivity?query=${query}`);
      const data = await response.data;
      if (Array.isArray(data) && data.length > 0) {
        setActivities(data);
      } else {
        setActivities(data);
        console.log("Activity array is empty or undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container mx-auto flex flex-col lg:flex-row">
        <div className="bg-white rounded-xl shadow-md p-6 lg:w-1/3 mb-6 lg:mb-0 lg:mr-6">
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
                  Min Value: <span className="text-indigo-500 font-semibold">${minValue}</span>
                </p>
                <p className="maxValue text-gray-700">
                  Max Value: <span className="text-indigo-500 font-semibold">${maxValue}</span>
                </p>
              </div>
            </div>
            <div className="Datediv mb-4">
              <label htmlFor="date" className="text-gray-700 font-semibold mb-1 block">Date:</label>
              <input id="date" type="date" className="border border-gray-300 p-2 rounded-lg w-full" />
            </div>
            <div className="Datediv mb-4">
              <label htmlFor="category" className="text-gray-700 font-semibold mb-1 block">Category:</label>
              <select id="category" className="border border-gray-300 p-2 rounded-lg w-full">
                <option value="All">All</option>
                <option value="food">Food</option>
                <option value="comedy show">Comedy Show</option>
                <option value="parks">Parks</option>
              </select>
            </div>
            <div className="Datediv mb-4">
              <label htmlFor="rating" className="text-gray-700 font-semibold mb-1 block">Rating:</label>
              <select id="rating" className="border border-gray-300 p-2 rounded-lg w-full">
                <option value="All">All</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div className="filterButtonDiv mb-4">
              <button
                onClick={filterActivity}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Filter
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                id="searchInput"
                placeholder="Search for Activity..."
                className="border border-gray-300 p-2 rounded-lg w-full mb-2"
              />
              <button
                onClick={searchActivity}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Search
              </button>
            </div>
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
                onClick={sortActivity}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sort
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
            Browse Activities
          </h2>

          {/* Create Activity Button */}
          {showCreateButton && (
            <div className="flex justify-center mb-6">
              
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <Activity
                  key={activity.id}
                  activity={activity}
                  showUpdateButton={showUpdateButton} // Set visibility flags based on props
                  showDeleteButton={showDeleteButton}
                  onUpdate={() => console.log(`Updating activity ${activity.id}`)}
                  onDelete={() => console.log(`Deleting activity ${activity.id}`)}
                />
              ))
            ) : (
              <p>No activities found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
