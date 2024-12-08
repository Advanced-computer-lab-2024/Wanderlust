import React from 'react';
import Itineraries from '../../Components/Itinerary-nobuttons';
import GuestNavbar from '../../Components/NavBars/GuestNavBar';

const Itinerary = () => {
  return (
    <>
      <GuestNavbar />
      <Itineraries showUpdateButton={false} showBookButton={false} showBookmark={false} showBookButtonItinerary={false} showDeleteButton={false} />
    </>
  );
};

export default Itinerary;