import React from 'react';
import Navbar from '../Components/Navbar';
import ComplaintsTourist from '../Components/ComplaintsTourist';
import TouristNavBar from '../Components/NavBars/TouristNavBar';

const AdminDashboard = () => {
    return (
        <>
        <TouristNavBar />
        <ComplaintsTourist/>
        </>
        
    );
};

export default AdminDashboard;