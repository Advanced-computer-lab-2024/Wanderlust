import React from 'react';
import Navbar from '../Components/Navbar';
import Itineraries from '../Components/ItineraryList'; // Assuming this is where your Itinerary component is

const Itinerary = () => {
  return (
    <>
      <Navbar t1={"Profile"} p1={"/tgProfile"} t2={"Itinerary"} p2={"/Itinerary"} />
      <Itineraries 
       
      /> 
    </>
  );
};

export default Itinerary;