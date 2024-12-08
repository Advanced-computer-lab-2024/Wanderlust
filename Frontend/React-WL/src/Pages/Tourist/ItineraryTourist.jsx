import React from 'react'
import Itineraries from '../../Components/Itinerary-nobuttons'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const ItineraryTourist = () => {
  return (
    <>
    
    <TouristNavBar  />
    <div style={{ height: '35px' }}></div>
    <Itineraries guestMode={false} showBookButton={false} showBookmark={false} showCreateButton={false} showDeleteButton={false} showUpdateButton={false}/>
    

   
    </>
  )
}

export default ItineraryTourist