import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <div className="d-flex flex-wrap gap-3">
        {pendingUsers.pendingAdvertisers.map(advertiser => (
          <div key={advertiser._id} className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
            <h2 className='fw-bold'>Advertiser</h2>
            <p><strong>Username:</strong> {advertiser.userId.username}</p>
            <p><strong>Email:</strong> {advertiser.userId.email}</p>
            <p><strong>Website:</strong> {advertiser.website}</p>
            <p><strong>Hotline:</strong> {advertiser.hotline}</p>
            <p><strong>Company Profile:</strong> {advertiser.companyProfile}</p>
            <p><strong>ID URL:</strong> {advertiser.IdURL}</p>
            <p><strong>Taxation Registry Card URL:</strong> {advertiser.taxationRegistryCardURL}</p>
            <p><strong>Logo URL:</strong> {advertiser.logoURL}</p>
            <button className="btn btn-success mt-2 me-1" onClick={() => handleApproveUser(advertiser.userId._id, 'Advertiser')}>Approve</button>
            <button className="btn btn-danger mt-2" onClick={() => handleRejectUser(advertiser.userId._id, 'Advertiser')}>Reject</button>
          </div>
        ))}
        {pendingUsers.pendingSellers.map(seller => (
          <div key={seller._id} className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
            <h2>Seller</h2>
            <p><strong>Username:</strong> {seller.userId.username}</p>
            <p><strong>Email:</strong> {seller.userId.email}</p>
            <p><strong>Description:</strong> {seller.description}</p>
            <p><strong>Type:</strong> {seller.type}</p>
            <p><strong>ID URL:</strong> {seller.IdURL}</p>
            <p><strong>Taxation Registry Card URL:</strong> {seller.taxationRegistryCardURL}</p>
            <p><strong>Logo URL:</strong> {seller.logoURL}</p>
            <button className="btn btn-success mt-2" onClick={() => handleApproveUser(seller.userId._id, 'Seller')}>Approve</button>
            <button className="btn btn-danger mt-2" onClick={() => handleRejectUser(seller.userId._id, 'Seller')}>Reject</button>
          </div>
        ))}
        {pendingUsers.pendingTourGuides.map(tourGuide => (
          <div key={tourGuide._id} className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
            <h2>Tour Guide</h2>
            <p><strong>Username:</strong> {tourGuide.userId.username}</p>
            <p><strong>Email:</strong> {tourGuide.userId.email}</p>
            <p><strong>ID URL:</strong> {tourGuide.IdURL}</p>
            <p><strong>Certificates URL:</strong> {tourGuide.certificatesURL}</p>
            <button className="btn btn-success mt-2" onClick={() => handleApproveUser(tourGuide.userId._id, 'TourGuide')}>Approve</button>
            <button className="btn btn-danger mt-2" onClick={() => handleRejectUser(tourGuide.userId._id, 'TourGuide')}>Reject</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPendingDocuments;