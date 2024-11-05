import React from 'react';
import Itineraries from '../../Components/ItineraryList'; // Assuming this is where your Itinerary component is
import GuestNavbar from '../../Components/NavBars/GuestNavBar';
const Itinerary = () => {
  return (
    <>
    <GuestNavbar />
    <Itineraries />
    </>
  );
};

export default Itinerary;