import React from 'react';
import './WhatToExpect.css';
import passport from '../assets/images/passport.png'; // Adjust paths as needed
import itin from '../assets/images/itin.png';
import dollar from '../assets/images/dollar.png';
import notif from '../assets/images/notif.png';

const WhatToExpect = () => {
  return (
    <footer className="what-to-expect-footer">
      <h2>What to Expect?</h2>
      <div className="footer-partitions">
        <div className="footer-partition">
          <img src={passport} alt="Personalized Travel Planning" className="icon" />
          <h3>Personalized Travel Planning</h3>
          <p>Tailor your vacation with preferences like historic sites, beaches, shopping, and budget-friendly options.</p>
        </div>
        <div className="footer-partition">
          <img src={itin} alt="Tour Guides & Itineraries" className="icon" />
          <h3>Tour Guides & Itineraries</h3>
          <p>Find expert-guided tours or create your own adventure with customizable itineraries and detailed activity breakdowns.</p>
        </div>
        <div className="footer-partition">
          <img src={dollar} alt="Smart Budgeting" className="icon" />
          <h3>Smart Budgeting</h3>
          <p>Manage your travel budget with ease. Stay on top of your expenses with our intuitive budgeting tools. Plan ahead, set spending limits, and track your costs in real-time to make the most of your travel without breaking the bank.</p>
        </div>
        <div className="footer-partition">
          <img src={notif} alt="Real-Time Notifications" className="icon" />
          <h3>Real-Time Notifications</h3>
          <p>Receive timely updates for your travels. Get instant alerts for flight changes, booking confirmations, and more. Stay informed and ready for anything during your journey, ensuring a smooth and stress-free travel experience.</p>
        </div>
      </div>
    </footer>
  );
};

export default WhatToExpect;
