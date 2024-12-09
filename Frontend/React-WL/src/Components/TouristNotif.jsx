import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TouristNotif = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found. Please log in.');
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let response1;
      try {
        response1 = await axios.get('http://localhost:8000/api/tourist/getNotification', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error fetching notifications from getNotification:', error);
        response1 = { data: [] }; // Fallback to empty data
      }

      const response2 = await axios.get('http://localhost:8000/api/tourist/getNotificationsAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response2.status === 200) {
        console.log(token);

        const combinedNotifications = [...response1.data, ...response2.data];
        setNotifications(combinedNotifications);
        console.log(combinedNotifications);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Upcoming Events</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center text-xl">{error}</div>
      ) : (
        <div>
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500">No notifications available.</div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex flex-col">
                    <p className="font-medium text-blue-800">
                      {/* Hyperlink for event name */}
                      <Link
                          to={
                            notification.eventType === 'itinerary'
                              ? `/ItineraryTourist`
                              : `/ActivityTourist`
                          }
                          className="text-blue-500 hover:underline"
                        >
                          {notification.message}
                      </Link>
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-indigo-500 ml-4">
                    <i className="fas fa-bell"></i>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TouristNotif;