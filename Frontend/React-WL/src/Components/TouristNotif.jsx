import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const TouristNotif = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:8000/api/notifications/get-notifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setNotifications(response.data);
          console.log(response.data);
        } else {
          alert('Failed to fetch notifications: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const socket = io('http://localhost:8000');
    const userId = localStorage.getItem('userId');

    if (userId) {
      socket.emit('join', userId);
    }

    socket.on('new-notification', (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4 w-75">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Upcoming Events</h1>
      <ul className="list-group">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map(notification => (
            <li key={notification._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">{notification.message}</p>
                  <small className="text-muted">{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
                <span className={`badge ${notification.read ? 'bg-success' : 'bg-secondary'}`}>
                  {notification.read ? 'Read' : 'Unread'}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TouristNotif;