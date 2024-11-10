import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboardComponent = () => {
    const navigate = useNavigate();

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
    const handleViewProducts = () => {
        navigate('/adminviewproducts');
    }

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
                {/* <div className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                    <h2 className='text-gray-800 font-semibold'>View Product Details</h2>
                    <p>View the available quantity, and sales of each product.</p>
                    <button className="btn btn-primary" onClick={handleViewProducts}>View Products</button>
                </div> */}
            </div>
        </div>
    );
};

export default AdminDashboardComponent;