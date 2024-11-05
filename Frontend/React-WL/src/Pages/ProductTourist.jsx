import React from 'react'
import Navbar from '../Components/Navbar'
import Itineraries from '../Components/Itinerary-nobuttons'
import Activities from '../Components/Activities'
import Locations from '../Components/LocationList'
import Products from '../Components/Products-nobuttons'
import TouristNavBar from '../Components/NavBars/TouristNavBar'

const ProductTourist = () => {
  return (
    <>
    
    <TouristNavBar  />
    <Products/>

   
    </>
  )
}

export default ProductTourist