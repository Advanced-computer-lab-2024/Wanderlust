import React from 'react'
import Navbar from '../Components/Navbar'
import Itineraries from '../Components/ItineraryList'

const Itinerary = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/tgProfile"} t2={"Itinerary"} p2={"/Itinerary"} />
    <Itineraries />
    </>
  )
}

export default Itinerary