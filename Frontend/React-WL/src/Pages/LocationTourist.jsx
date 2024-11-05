import React from 'react'
import Navbar from '../Components/Navbar'
import Itineraries from '../Components/Itinerary-nobuttons'
import Activities from '../Components/Activities'
import Locations from '../Components/LocationList'
import TouristNavBar from '../Components/NavBars/TouristNavBar'

const LocationTourist = () => {
  return (
    <>
    
    <TouristNavBar  />
    <Locations />

   
    </>
  )
}

export default LocationTourist