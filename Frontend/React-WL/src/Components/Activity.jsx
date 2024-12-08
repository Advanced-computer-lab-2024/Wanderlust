import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingActivity from "./BookingActivity";
import { Edit3, Trash2, DollarSign, Euro, PoundSterling, Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const Activity = ({ 
  activity,
  showUpdateButton = true,
  showDeleteButton = true,
  showBookButton = true, // Added showBookButton
  onUpdate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get("http://localhost:8000/api/tourist/getTourist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrency(response.data.currency);
      } catch (error) {
        console.error("Error fetching currency:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedActivities = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get("http://localhost:8000/api/activity/savedActivities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedActivities = response.data;
        const isActivitySaved = savedActivities.some(savedActivity => savedActivity._id === activity._id);
        setIsSaved(isActivitySaved);
      } catch (error) {
        console.error("Error fetching saved activities:", error);
      }
    };

    fetchCurrency();
    fetchSavedActivities();
  }, [activity._id]);

  useEffect(() => {
    if (activity.comments && activity.comments.length > 0) {
      const totalRating = activity.comments.reduce((sum, comment) => sum + comment.rating, 0);
      const avgRating = totalRating / activity.comments.length;
      setAverageRating(avgRating);
    }
  }, [activity.comments]);

  const getGoogleMapsEmbedUrl = (lat, lng) => {
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyA_eS_8ocAw_f4vgD01n-_vDIXG16QixpI&q=${lat},${lng}`;
  };

  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case "USD":
        return <DollarSign className="inline-block mr-1" size={16} />;
      case "EUR":
        return <Euro className="inline-block mr-1" size={16} />;
      case "GBP":
        return <PoundSterling className="inline-block mr-1" size={16} />;
      case "SAR":
        return "SAR ";
      default:
        return <PoundSterling className="inline-block mr-1" size={16} />;
    }
  };

  const handleBookActivity = async () => {
    navigate("/BookingActivityPage", {
      state: { activityId: activity._id, price: activity.price },
    });
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleSaveActivity = async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/activity/saveActivity',
        { activityId: activity._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setIsSaved(true);
        console.log('Activity saved successfully');
      } else {
        console.error('Failed to save activity');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
    } finally {
      setLoading(false);
    }
  };
const handleUnsaveActivity = async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/activity/unsaveActivity',
        { activityId: activity._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setIsSaved(false);
        console.log('Activity unsaved successfully');
      } else {
        console.error('Failed to unsave activity');
      }
    } catch (error) {
      console.error('Error unsaving activity:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md relative flex p-2 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
      {/* Display activity picture */}
      {activity.picture && (
        <div className="w-1/3 p-1 flex items-center">
          <img src={activity.picture} alt={activity.name} className="w-full h-32 object-contain rounded-md" />
        </div>
      )}
      <div className="w-2/3 p-1 flex flex-col justify-between">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-md font-bold leading-tight">{activity.name}</h3>
            {activity.description && (
              <p className="text-gray-700 text-sm font-medium">{activity.description}</p>
            )}
            <div className="mt-1">
              <a onClick={toggleDetails} className="custom underline cursor-pointer text-xs">
                More Details
              </a>
            </div>
          </div>
          <div className="flex justify-between items-start mt-2">
            <Box sx={{ '& > legend': { mt: 1 }, paddingTop: 2 }}>
              <Typography component="legend" sx={{ color: 'black', fontSize: '1rem' }}>Rating:</Typography>
              <Rating name="read-only" value={averageRating} readOnly sx={{ color: 'gold', fontSize: '1.5rem' }} />
            </Box>
            <div className="text-right pr-4 mt-2">
              {!loading && (
                <h3 className="custom text-lg font-semibold mb-1">
                  {activity.specialDiscounts && activity.specialDiscounts !== "undefined" && (
                    <button className="bg-green-500 text-white text-xs font-semibold py-1 px-2 rounded-md mr-2 cursor-default">
                      {activity.specialDiscounts}
                    </button>
                  )}
                  {getCurrencyIcon(currency)}{activity.price}
                </h3>
              )}
              <div className="flex space-x-2">
                {showBookButton && ( // Added showBookButton logic
                  <button
                    onClick={handleBookActivity}
                    className="bg-custom text-white px-3 py-2 rounded-md text-sm mt-1 transition duration-300 ease-in-out transform hover:bg-blue-600"
                  >
                    Book Activity
                  </button>
                )}
                <button
                  onClick={isSaved ? handleUnsaveActivity : handleSaveActivity}
                  className="bg-custom text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:bg-blue-600 flex items-center text-xs"
                >
                  {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {detailsVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
          <div className="bg-white rounded-xl shadow-md relative p-4 w-11/12 md:w-2/3 lg:w-1/2 overflow-auto max-h-full">
            <button onClick={toggleDetails} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              &times;
            </button>
            <div className="mb-2">
              <div className="text-gray-600 text-xs">
                {activity.category?.name || "N/A"}
              </div>
              <h3 className="text-md font-bold leading-tight">{activity.name}</h3>
              <p className="text-gray-500 text-xs">
                {new Date(activity.date).toLocaleDateString()} {activity.time}
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="mb-2">
              <div className="w-full h-32">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={getGoogleMapsEmbedUrl(activity.lat, activity.lng)}
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="mb-2">
              <span className="text-gray-600 text-xs">
                {activity.specialDiscounts}
              </span>
            </div>

            <h3 className="custom text-sm font-semibold mb-1">
              {getCurrencyIcon(currency)}{activity.price}
            </h3>
            <p className="text-gray-500 text-xs">Duration: {activity.duration}</p>
            <p className="text-gray-500 text-xs">
              Rating: {averageRating ? averageRating.toFixed(1) : "Not Rated"}
            </p>
            <p className="text-gray-500 text-xs">
              <strong>Booking Open: {activity.bookingOpen ? "Yes" : "No"}</strong>
            </p>

            <div className="mt-1">
              <h4 className="font-semibold text-xs">Tags:</h4>
              <div className="flex flex-wrap">
                {activity.tags && activity.tags.length > 0 ? (
                  activity.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs mr-1 mb-1"
                    >
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">No Tags</span>
                )}
              </div>
            </div>
            <div className="mt-2">
              <button
                onClick={handleBookActivity}
                className="bg-custom text-white px-2 py-1 rounded-md text-xs transition duration-300 ease-in-out transform hover:bg-blue-600"
              >
                Book Activity
              </button>
            </div>

            {/* Update and Delete Buttons */}
            <div className="flex justify-end space-x-1 mt-2">
              {showUpdateButton && (
                <button
                  onClick={() => onUpdate(activity.id)}
                  className="custom hover:bg-indigo-600 text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center text-xs"
                >
                  <Edit3 className="mr-1" size={12} /> Update
                </button>
              )}
              {showDeleteButton && (
                <button
                  onClick={() => onDelete(activity.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 flex items-center text-xs"
                >
                  <Trash2 className="mr-1" size={12} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
