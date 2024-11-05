import React from 'react'
import Navbar from '../Components/Navbar'
import Itineraries from '../Components/Itinerary-nobuttons'
import Activities from '../Components/Activities-nobuttons'
import Locations from '../Components/LocationList'
import TouristNavBar from '../Components/NavBars/TouristNavBar'

const ItineraryTourist = () => {
  return (
    <>
    
    <TouristNavBar  />
    <div style={{ height: '35px' }}></div>
    <Itineraries />
    


   
    </>
  )
}

export default ItineraryTourist