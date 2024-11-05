import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
// import Tourguide from './Pages/Tourguide';
import Itinerary from './Pages/Guest/Itinerary';
import AdminDashboard from './Pages/AdminDashboard';
import AddAdminPage from './Pages/AddAdminPage';
import AddTourismGovernorPage from './Pages/AddTourismGovernorPage';
import AdminViewUsersPage from './Pages/AdminViewUsersPage';
import AdminManageProductsPage from './Pages/AdminManageProductsPage';
import AdminManageActivitiesPage from './Pages/AdminManageActivitiesPage';
import AdminManagePreferenceTagsPage from './Pages/AdminManagePreferenceTagsPage';
import AdminManageComplaintsPage from './Pages/AdminManageComplaintsPage';
import Advertiser from './Pages/Advertiser';
import ActivitiesPage from './Pages/Guest/ActivitiesPage';
// import Tourist from './Pages/Tourist';
import ItineraryTourist from './Pages/Tourist/ItineraryTourist';
import LocationTourist from './Pages/Tourist/LocationTourist';
import ActivityTourist from './Pages/Tourist/ActivityTourist';
import SellerPage from './Pages/SellerPage';
import ProductTourist from './Pages/Tourist/ProductTourist';
import TourismGovernor from './Pages/TourismGovernor';
import TgProfile from './Pages/Tourguide/Tgprofile';
import Complaint from './Components/Admin/Complaint';
import ComplaintsTouristPage from './Pages/Tourist/ComplaintsTouristPage';

import  TouristProfilePage  from './Pages/Tourist/TouristProfilePage';
import LocationsPage from './Pages/Guest/LocationsPage';
import ItineraryTourguidePage from './Pages/Tourguide/ItineraryTourguidePage';
import ActivityTourguidePage from './Pages/Tourguide/ActivityTourGuidePage';
const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/tourguide" element={<Tourguide />} /> */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/addadmin" element={<AddAdminPage />} />
        <Route path="/addtourismgovernor" element={<AddTourismGovernorPage />} />
        <Route path="/viewusers" element={<AdminViewUsersPage />} />
        <Route path="/manageproducts" element={<AdminManageProductsPage />} />
        <Route path="/manageactivities" element={<AdminManageActivitiesPage />} />
        <Route path="/managepreferencetags" element={<AdminManagePreferenceTagsPage />} />
        <Route path="/managecomplaints" element={<AdminManageComplaintsPage />} />
        <Route path="/advertiser" element={<Advertiser />} />
        <Route path="/seller" element={<SellerPage/>} />
        <Route path="/TourismGovernor" element={<TourismGovernor />} />
        <Route path="/complaint" element={<Complaint />} />




        {/* //tourist routes */}
        {/* <Route path="/tourist" element={<Tourist />} /> */}
        <Route path="/ItineraryTourist" element={<ItineraryTourist />} />
        <Route path="/LocationTourist" element={<LocationTourist />} />
        <Route path="/ActivityTourist" element={<ActivityTourist />} />
        <Route path="/ProductTourist" element={<ProductTourist />} />
        <Route path="/ComplaintsTourist" element={<ComplaintsTouristPage />} />
        <Route path="/TouristProfile" element={<TouristProfilePage />} />

        {/* Guest Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/LocationPage" element={<LocationsPage />} />
        <Route path="/activitiesPage" element={<ActivitiesPage />} />
        <Route path="/itinerary" element={<Itinerary />} />


        {/* Tourguide Routes */}
        <Route path="/TgProfile" element={<TgProfile />} />
        <Route path="/ItineraryTourguide" element={<ItineraryTourguidePage />} />
        <Route path="/ActivityTourguide" element={<ActivityTourguidePage />} />

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