import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import Tourguide from './Pages/Tourguide';
import Itinerary from './Pages/Itinerary';

const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tourguide" element={<Tourguide />} />
        <Route path="/itinerary" element={<Itinerary />} />
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