import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import Tourguide from './Pages/Tourguide';
import Itinerary from './Pages/Itinerary';
import AdminDashboard from './Pages/AdminDashboard';
import AddAdminPage from './Pages/AddAdminPage';
import AddTourismGovernorPage from './Pages/AddTourismGovernorPage';
import AdminViewUsersPage from './Pages/AdminViewUsersPage';
import AdminManageProductsPage from './Pages/AdminManageProductsPage';
import AdminManageActivitiesPage from './Pages/AdminManageActivitiesPage';
import AdminManagePreferenceTagsPage from './Pages/AdminManagePreferenceTagsPage';
import Advertiser from './Pages/Advertiser';
import ActivitiesPage from './Pages/ActivitiesPage';
import Tourist from './Pages/Tourist';
import ItineraryTourist from './Pages/ItineraryTourist';
import LocationTourist from './Pages/LocationTourist';
import ActivityTourist from './Pages/ActivityTourist';

const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tourguide" element={<Tourguide />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/addadmin" element={<AddAdminPage />} />
        <Route path="/addtourismgovernor" element={<AddTourismGovernorPage />} />
        <Route path="/viewusers" element={<AdminViewUsersPage />} />
        <Route path="/manageproducts" element={<AdminManageProductsPage />} />
        <Route path="/manageactivities" element={<AdminManageActivitiesPage />} />
        <Route path="/managepreferencetags" element={<AdminManagePreferenceTagsPage />} />
        <Route path="/advertiser" element={<Advertiser />} />
        <Route path="/activitiesPage" element={<ActivitiesPage />} />




        <Route path="/tourist" element={<Tourist />} />
        <Route path="/ItineraryTourist" element={<ItineraryTourist />} />
        <Route path="/LocationTourist" element={<LocationTourist />} />
        <Route path="/ActivityTourist" element={<ActivityTourist />} />
        
      
        {/* <Route path="/advertiser" element={<Advertiser />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/tourism-governor" element={<TourismGovernor />} />
        <Route path="/tourist" element={<Tourist />} />
        <Route path="/register" element={<Register />} />*/}
      </Routes> 
    </Router>
  );
};

export default App;