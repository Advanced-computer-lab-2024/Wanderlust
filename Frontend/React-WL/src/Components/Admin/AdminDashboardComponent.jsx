import React,{ useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


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
    const handleCreatePromoCode = () => {
        navigate('/createpromocode');
      };
    return (
      <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-lock me-2"></i> Update Password
            </div>
            <div className="card-body">
              <h5 className="card-title">Update your Admin password</h5>
              <button className="btn btn-primary mt-2" onClick={handleUpdatePassword}>
                Update Password
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-user me-2"></i> Manage Users
            </div>
            <div className="card-body">
              <h5 className="card-title">View and manage all users</h5>
              <button className="btn btn-primary mt-2" onClick={handleManageUsers}>
                Manage Users
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-boxes me-2"></i> Manage Products
            </div>
            <div className="card-body">
              <h5 className="card-title">View and manage all products</h5>
              <button className="btn btn-primary mt-2" onClick={handleManageProducts}>
                Go to Products
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-tags me-2"></i> Manage Activity Categories
            </div>
            <div className="card-body">
              <h5 className="card-title">View and manage activity categories</h5>
              <button className="btn btn-primary mt-2" onClick={handleManageActivities}>
                Manage Activity Categories
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-user-plus me-2"></i> Add Admin
            </div>
            <div className="card-body">
              <h5 className="card-title">Add a new admin to the system</h5>
              <button className="btn btn-primary mt-2" onClick={handleAddAdmin}>
                Add Admin
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-map-marked-alt me-2"></i> Add Tourism Governor
            </div>
            <div className="card-body">
              <h5 className="card-title">Add a new tourism governor</h5>
              <button className="btn btn-primary mt-2" onClick={handleAddTourismGovernor}>
                Add Tourism Governor
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-tag me-2"></i> Manage Preference Tags
            </div>
            <div className="card-body">
              <h5 className="card-title">View and manage all preference tags</h5>
              <button className="btn btn-primary mt-2" onClick={handleManagePreferenceTags}>
                Manage Preference Tags
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-comment-dots me-2"></i> Manage Complaints
            </div>
            <div className="card-body">
              <h5 className="card-title">View and manage all complaints</h5>
              <button className="btn btn-primary mt-2" onClick={handleManageComplaints}>
                Manage Complaints
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-user-clock me-2"></i> Manage Pending Users
            </div>
            <div className="card-body">
              <h5 className="card-title">View and manage all pending users based on their documents</h5>
              <button className="btn btn-primary mt-2" onClick={handleManagePendingUsers}>
                View Documents
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-map me-2"></i> Manage Itineraries
            </div>
            <div className="card-body">
              <h5 className="card-title">View and manage all itineraries</h5>
              <button className="btn btn-primary mt-2" onClick={handleManageItinerary}>
                View Itineraries
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-percentage me-2"></i> Create Promocode
            </div>
            <div className="card-body">
              <h5 className="card-title">View and create promo codes</h5>
              <button className="btn btn-primary mt-2" onClick={handleCreatePromoCode}>
                Create Promocode
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-0">
            <div className="card-header">
              <i className="fas fa-bell me-2"></i> View Notifications
            </div>
            <div className="card-body">
              <h5 className="card-title">View all notifications</h5>
              <button className="btn btn-primary mt-2 position-relative" onClick={handleViewNotifications}>
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
      </div>
    </div>
    


    
    );
};

export default AdminDashboardComponent;