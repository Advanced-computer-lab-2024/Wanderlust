import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TouristBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwtToken'); // Assuming token is stored in localStorage

  useEffect(() => {
    fetchTouristBookmarks();
  }, []);

  const fetchTouristBookmarks = async () => {
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
        fetchTouristBookmarks(); // Refresh the bookmarks
      } else {
        alert('Failed to unsave activity');
      }
    } catch (error) {
      console.error('Error unsaving activity:', error);
      alert('Error unsaving activity');
    }
  };

  const handleRequestNotification = async (activityId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/activity/requestNotification',
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

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-center text-2xl font-bold text-gray-800">My Bookmarks</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <h1 className="text-center text-red-500">{error}</h1>
      ) : Array.isArray(bookmarks) && bookmarks.length > 0 ? (
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
                onClick={() => handleRequestNotification(activity._id)}
              >
                Request Notification
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Your bookmarks are empty.</p>
      )}
    </div>
  );
};

export default TouristBookmarks;