import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristNotif = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const authToken = localStorage.getItem('authToken'); // Assuming you store the token in localStorage
        const response = await axios.get('http://localhost:8000/api/tourist/get-notifications', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Upcoming Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <p>{notification.message}</p>
              <p>Date: {new Date(notification.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TouristNotif;