import React from 'react';
import Itineraries from '../../Components/Itinerary-nobuttons';
import GuestNavbar from '../../Components/NavBars/GuestNavBar';

const Itinerary = () => {
  return (
    <>
      <GuestNavbar />
      <Itineraries showUpdateButton={false} showBookButton={false} showBookmark={false} showBookButtonItinerary={false} showDeleteButton={false} />
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>

    </>
  );
};

export default Itinerary;