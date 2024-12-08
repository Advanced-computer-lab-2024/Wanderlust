import React from 'react'
import Itineraries from '../../Components/Itinerary-nobuttons'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const ItineraryTourist = () => {
  return (
    <>
    
    <TouristNavBar  />
    <Itineraries guestMode={false} showBookButton={false} showBookmark={true} showCreateButton={false} showDeleteButton={false} showUpdateButton={false}/>
    

   
    </>
  )
}

export default ItineraryTourist