import React,{ useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboardComponent = () => {
    const [notificationsCount, setNotificationsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotificationsCount();
  }, []);

  const fetchNotificationsCount = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8000/api/admin/getNotifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setNotificationsCount(response.data.length);
      } else {
        alert('Failed to fetch notifications: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
    const handleAddAdmin = () => {
        navigate('/addadmin');
    };
    const handleAddTourismGovernor = () => {
        navigate('/addtourismgovernor');
    };
    const handleManageUsers = () => {
        navigate('/viewusers');
    };
    const handleManageProducts = () => {
        navigate('/manageproducts');
    };
    const handleManageActivities = () => {
        navigate('/manageactivities');
    };
    const handleManagePreferenceTags = () => {
        navigate('/managepreferencetags');
    };
    const handleManageComplaints = () => {
        navigate('/managecomplaints');
    }
    const handleManagePendingUsers = () => {
        navigate('/viewpendingdocuments');
    }
    const handleUpdatePassword = () => {
        navigate('/AdminUpdatePassword');
    }
    const handleManageItinerary = () => {
        navigate('/AdminManageItinerary');
    }
    const handleViewNotifications = () => {
        navigate('/viewnotifications');
      };
    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className='text-2xl font-bold mb-6 text-center'>Admin Dashboard</h1>
            </div>
            <div className="d-flex flex-wrap gap-3">
            <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Update Password</h2>
                    <p>Update your Admin password.</p>
                    <button className="btn btn-primary" onClick={handleUpdatePassword}>Update Password</button>
                </div>
            <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Manage Users</h2>
                    <p>View and manage all users in the system.</p>
                    <button className="btn btn-primary" onClick={handleManageUsers}>Manage Users</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Manage Products</h2>
                    <p>View and manage all products.</p>
                    <button className="btn btn-primary" onClick={handleManageProducts}>Go to Products</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Manage Activities</h2>
                    <p>View and manage all activity categories.</p>
                    <button className="btn btn-primary" onClick={handleManageActivities}>Manage Activities</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Add Admin</h2>
                    <p>Add a new admin to the system.</p>
                    <button className="btn btn-primary" onClick={handleAddAdmin}>Add Admin</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Add Tourism Governor</h2>
                    <p>Add a new tourism governor to the system.</p>
                    <button className="btn btn-primary" onClick={handleAddTourismGovernor}>Add Tourism Governor</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Manage Preference Tags</h2>
                    <p>View and manage all preference tags.</p>
                    <button className="btn btn-primary" onClick={handleManagePreferenceTags}>Manage Preference Tags</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Manage Complaints</h2>
                    <p>View and manage all complaints.</p>
                    <button className="btn btn-primary" onClick={handleManageComplaints}>Manage Complaints</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Manage Pending Users</h2>
                    <p>View and manage all pending users based on their documents.</p>
                    <button className="btn btn-primary" onClick={handleManagePendingUsers}>View Documents</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>Manage Itineraries</h2>
                    <p>View and manage all Itineraries.</p>
                    <button className="btn btn-primary" onClick={handleManageItinerary}>View Itineraries</button>
                </div>
                <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
          <h2 className='text-gray-800 font-semibold'>View Notifications</h2>
          <p>View all notifications.</p>
          <button className="btn btn-primary position-relative" onClick={handleViewNotifications}>
            View Notifications
            {notificationsCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notificationsCount}
                <span className="visually-hidden">unread notifications</span>
              </span>
            )}
          </button>
        </div>
                
            </div>
        </div>
    );
};

export default AdminDashboardComponent;