import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TouristBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const token = localStorage.getItem('jwtToken'); 

  useEffect(() => {
    fetchSavedActivites();
    fetchSavedItineraries();
  }, []);

  const fetchSavedActivites = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/activity/savedActivities',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Fetched bookmarks:', response.data); // Debugging log
      setBookmarks(response.data); // Adjust based on API response structure
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError(error.response?.data?.message || 'Failed to load bookmarks.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveActivity = async (activityId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/activity/unsaveActivity',
        { activityId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert('Activity unsaved successfully');
        fetchSavedActivites(); // Refresh the bookmarks
      } else {
        alert('Failed to unsave activity');
      }
    } catch (error) {
      console.error('Error unsaving activity:', error);
      alert('Error unsaving activity');
    }
  };

  const handleReqActivityNotification = async (activityId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/tourist//request-notification',
        { activityId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert('Notification request saved successfully');
      } else {
        alert('Failed to save notification request');
      }
    } catch (error) {
      console.error('Error saving notification request:', error);
      alert('Error saving notification request');
    }
  };
  const fetchSavedItineraries = async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    try {
      const response = await axios.get(
        'http://localhost:8000/api/itinerary/savedItineraries',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        setSavedItineraries(response.data);
      } else {
        console.error('Failed to fetch saved itineraries');
      }
    } catch (error) {
      console.error('Error fetching saved itineraries:', error);
    }
  };
  
  const handleUnsaveItinerary = async (itineraryId) => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/itinerary/unsaveItinerary',
        { itineraryId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        alert('Itinerary unsaved successfully');
        fetchSavedItineraries(); // Refresh the saved itineraries
      } else {
        alert('Failed to unsave itinerary');
      }
    } catch (error) {
      console.error('Error unsaving itinerary:', error);
      alert('Error unsaving itinerary');
    }
  };
  const handleReqItineraryNotification = async (itineraryId) => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/tourist/request-notification',
        { itineraryId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        alert('Notification requested successfully');
      } else {
        alert('Failed to request notification');
      }
    } catch (error) {
      console.error('Error requesting notification:', error);
      alert('Error requesting notification');
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">My Saved Spots</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <h1 className="text-center text-red-500">{error}</h1>
      ) : (
        <>
          {/* Render Saved Activities */}
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Saved Activities</h2>
          {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
            bookmarks.map((activity) => (
              <div key={activity._id} className="border border-gray-300 p-4 my-2 rounded-md">
                <Link to={`/ActivityTourist`} className="text-blue-500 hover:underline">
                  <h3 className="text-lg font-semibold mb-2">{activity.name}</h3>
                </Link>
                <p className="mb-1">{activity.description}</p>
                <p className="mb-1">Date: {activity.date}</p>
                <p className="mb-1">Duration: {activity.duration}</p>
                <p className="mb-1">Time: {activity.time}</p>
                <div className="flex justify-between mt-2">
                  <button
                    className="bg-custom text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center text-xs"
                    onClick={() => handleUnsaveActivity(activity._id)}
                  >
                    Unsave
                  </button>
                  <button
                    className="bg-custom text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center text-xs"
                    onClick={() => handleReqActivityNotification(activity._id)}
                  >
                    Request Notification
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">You have no saved activities.</p>
          )}
  
          {/* Render Saved Itineraries */}
          <h2 className="text-xl font-semibold text-gray-700 mt-6">Saved Itineraries</h2>
          {Array.isArray(savedItineraries) && savedItineraries.length > 0 ? (
            savedItineraries.map((itinerary) => (
              <div key={itinerary._id} className="border border-gray-300 p-4 my-2 rounded-md">
                <Link to={`/ItineraryTourist`} className="text-blue-500 hover:underline">
                  <h3 className="text-lg font-semibold mb-2">{itinerary.title}</h3>
                </Link>
                <p className="mb-1">Price: {itinerary.price}</p>
                <p className="mb-1">Location: {itinerary.locations.join(', ')}</p>
                <p className="mb-1">Date: {new Date(itinerary.timeline.start).toLocaleDateString()}</p>
                <p className="mb-1">Available Dates: {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ')}</p>
                <p className="mb-1">Pickup Location: {itinerary.pickupLocation}</p>
                <p className="mb-1">Dropoff Location: {itinerary.dropoffLocation}</p>
                <div className="flex justify-between mt-2">
                  <button
                    className="bg-custom text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center text-xs"
                    onClick={() => handleUnsaveItinerary(itinerary._id)}
                  >
                    Unsave
                  </button>
                  <button
                    className="bg-custom text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center text-xs"
                    onClick={() => handleReqItineraryNotification(itinerary._id)}
                  >
                    Request Notification
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">You have no saved itineraries.</p>
          )}
        </>
      )}
    </div>
  );  
};

export default TouristBookmarks;