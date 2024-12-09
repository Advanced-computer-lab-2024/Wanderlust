import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/adminstyle.css'
const ViewPendingDocuments = () => {
  const [pendingUsers, setPendingUsers] = useState({
    pendingAdvertisers: [],
    pendingSellers: [],
    pendingTourGuides: [],
  });

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/PendingUsers');
      if (response.status === 200) {
        setPendingUsers(response.data);
        console.log(response.data);
      } else {
        alert('Failed to fetch pending users: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const handleApproveUser = async (userId, userType) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/admin/approvePendingUser/${userId}`, {
        userType,
        status: 'approved'
      });
      if (response.status === 200) {
        alert('User approved successfully');
        fetchPendingUsers();
      } else {
        alert('Failed to approve user: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId, userType) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/admin/approvePendingUser/${userId}`, {
        userType,
        status: 'rejected'
      });
      if (response.status === 200) {
        alert('User rejected successfully');
        fetchPendingUsers();
      } else {
        alert('Failed to reject user: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className="container py-4 w-75">
      <div className="mb-4">
        <h1 className='text-2xl font-bold mb-6 text-center'>Pending Users</h1>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Type</th>
            <th>Username</th>
            <th>Email</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.pendingAdvertisers.map(advertiser => (
            <tr key={advertiser._id}>
              <td>Advertiser</td>
              <td>{advertiser.userId.username}</td>
              <td>{advertiser.userId.email}</td>
              <td>
                <p><strong>Website:</strong> {advertiser.website}</p>
                <p><strong>Hotline:</strong> {advertiser.hotline}</p>
                <p><strong>Company Profile:</strong> {advertiser.companyProfile}</p>
                <p><strong>ID URL:</strong> <a href={advertiser.IdURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
                <p><strong>Taxation Registry Card URL:</strong> <a href={advertiser.taxationRegistryCardURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
                <p><strong>Logo URL:</strong> <a href={advertiser.logoURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
              </td>
              <td>
                <button className="btn btn-success mt-2 me-1" onClick={() => handleApproveUser(advertiser.userId._id, 'Advertiser')}>Approve</button>
                <button className="btn btn-danger mt-2" onClick={() => handleRejectUser(advertiser.userId._id, 'Advertiser')}>Reject</button>
              </td>
            </tr>
          ))}
          {pendingUsers.pendingSellers.map(seller => (
            <tr key={seller._id}>
              <td>Seller</td>
              <td>{seller.userId.username}</td>
              <td>{seller.userId.email}</td>
              <td>
                <p><strong>Description:</strong> {seller.description}</p>
                <p><strong>Type:</strong> {seller.type}</p>
                <p><strong>ID URL:</strong> <a href={seller.IdURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
                <p><strong>Taxation Registry Card URL:</strong> <a href={seller.taxationRegistryCardURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
                <p><strong>Logo URL:</strong> <a href={seller.logoURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
              </td>
              <td>
                <button className="btn btn-success mt-2 me-1" onClick={() => handleApproveUser(seller.userId._id, 'Seller')}>Approve</button>
                <button className="btn btn-danger mt-2" onClick={() => handleRejectUser(seller.userId._id, 'Seller')}>Reject</button>
              </td>
            </tr>
          ))}
          {pendingUsers.pendingTourGuides.map(tourGuide => (
            <tr key={tourGuide._id}>
              <td>Tour Guide</td>
              <td>{tourGuide.userId.username}</td>
              <td>{tourGuide.userId.email}</td>
              <td>
                <p><strong>ID URL:</strong> <a href={tourGuide.IdURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
                <p><strong>Certificates URL:</strong> <a href={tourGuide.certificatesURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">View</a></p>
              </td>
              <td>
                <button className="btn btn-success mt-2 me-1" onClick={() => handleApproveUser(tourGuide.userId._id, 'TourGuide')}>Approve</button>
                <button className="btn btn-danger mt-2" onClick={() => handleRejectUser(tourGuide.userId._id, 'TourGuide')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPendingDocuments;