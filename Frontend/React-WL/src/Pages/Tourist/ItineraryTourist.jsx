import React from 'react'
import Itineraries from '../../Components/Itinerary-nobuttons'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const ItineraryTourist = () => {
  return (
    <>
    
    <TouristNavBar  />
    <Itineraries guestMode={false} showBookButton={false} showBookmark={true} showCreateButton={false} showDeleteButton={false} showUpdateButton={false}/>
    

    <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
  )
}

export default ItineraryTourist