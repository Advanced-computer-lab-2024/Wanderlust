import React from 'react'
import Itineraries from '../../Components/Itinerary-nobuttons'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const ItineraryTourist = () => {
  return (
    <>
    
    <TouristNavBar  />
    <div style={{ height: '35px' }}></div>
    <Itineraries guestMode={false} />
    


   
    </>
  )
}

export default ItineraryTourist