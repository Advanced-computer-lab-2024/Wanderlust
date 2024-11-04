import React from 'react'
import Navbar from '../Components/Navbar'
import TourGuideProfile from '../Components/TourGuideProfile'

const TgProfile = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/TgProfile"} t2={"Itinerary"} p2={"/Itinerary"} />
    <TourGuideProfile />
    
    
    
    </>
  )
}

export default TgProfile