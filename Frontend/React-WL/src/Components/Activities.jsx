import { useState, useEffect } from 'react';
import Activity from './Activity';
import MultiRangeSlider from "multi-range-slider-react";
import axios from 'axios';
import CreateActivityForm from './CreateActivityForm';
import { Search } from 'lucide-react';

const Activities = ({ 
  guestMode, 
  showCreateButton = true, 
  showUpdateButton = true, 
  showDeleteButton = true, 
  showBookButton = true, // Added showBookButton
  showBookmark = true // Added showBookmark
}) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minValue, set_minValue] = useState(1);
  const [maxValue, set_maxValue] = useState(1000);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [touristId, settouristId] = useState(null);

  const getTouristId = async () => {
    try {
      const [infoResponse, userResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        }),
        axios.get("http://localhost:8000/api/admin/getLoggedInUser", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        })
      ]);

      const combinedData = { ...infoResponse.data, ...userResponse.data };
      console.log(combinedData);
      return combinedData._id;
    } catch (error) {
      console.error("Error fetching tourist ID:", error);
      return 1; // Fallback ID for guest mode if API fails
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("guestMode:", guestMode);
  
        // Set or retrieve tourist ID based on guest mode
        if (guestMode) {
          settouristId(1); // Guest mode, using fallback ID 1
        } else {
          const id = await getTouristId();
          settouristId(id);
          console.log(id);
        }
  
        // Fetch activities using getActivity API
        const activityUrl = touristId === 1
          ? "http://localhost:8000/api/activity/getActivityGuest"
          : `http://localhost:8000/api/activity/getActivity?touristId=${touristId}`;
          
        const activityResponse = await axios.get(activityUrl, {
          headers: touristId !== 1 ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } : undefined
        });
        setActivities(activityResponse.data);
        console.log("Fetched activities:", activityResponse.data);
  
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
  
        // Step 3: Filter out activities that have already been booked
        const filteredActivities = activityResponse.data.filter(
          (activity) => !bookedActivityIds.includes(activity._id)
        );
  
        // Step 4: Update the state with the filtered activities
        setActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [guestMode, touristId]);
  

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

  const handleCreateActivity = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    // Refresh the activities list
    fetchActivities();
    handleCloseModal();
  };

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
            onClick={sortActivity}
            className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105 mt-3"
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
                  }}
                />
              </div>
              <div className="slidertext flex justify-between">
                <p className="minValue text-gray-700">
                  Min Value: <span className="text-custom font-semibold">${minValue}</span>
                </p>
                <p className="maxValue text-gray-700">
                  Max Value: <span className="text-custom font-semibold">${maxValue}</span>
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
                <option value="party">Party</option>
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
                className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-custom mb-6 text-center">
            Browse Activities
          </h2>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <input
                type="text"
                id="searchInput"
                placeholder="Search for Activity..."
                className="border border-gray-300 p-2 w-80 rounded-lg " // Changed width to w-80
              />
              <button
                onClick={searchActivity}
                className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2.5 px-3 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <Search size={16} />
              </button>
            </div>
            {showCreateButton && (
              <button
                onClick={handleCreateActivity}
                className="bg-custom hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Create Activity
              </button>
            )}
          </div>
          <div className="flex flex-col space-y-6">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <Activity
                  key={activity.id}
                  activity={activity}
                  showUpdateButton={showUpdateButton} // Set visibility flags based on props
                  showDeleteButton={showDeleteButton}
                  showBookButton={showBookButton} // Pass showBookButton prop
                  showBookmark={showBookmark} // Pass showBookmark prop
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
      {isCreateModalOpen && (
      <CreateActivityForm
        onClose={handleCloseModal}
        onSubmit={handleCreateSuccess}
      />
    )}


    </section>
  );
};

export default Activities;
