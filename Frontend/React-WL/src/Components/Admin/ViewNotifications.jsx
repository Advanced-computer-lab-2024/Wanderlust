import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/adminstyle.css'
const ViewNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8000/api/admin/getNotifications', {
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
    }
  };

  return (
    <div className="container mt-4 w-75">
      <h1 className="mb-4 text-2xl font-bold mb-6 text-center">Notifications</h1>
      <ul className="list-group">
        {notifications.map(notification => (
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
        ))}
      </ul>
    </div>
  );
};

export default ViewNotifications;