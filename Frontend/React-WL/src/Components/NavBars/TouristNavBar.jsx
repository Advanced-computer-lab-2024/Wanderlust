import React from 'react'
import Navbar from '../Navbar'

const TouristNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/TouristProfile"} t2={"Itineraries"} p2={"/ItineraryTourist"} t3={"Activities"} p3={"/ActivityTourist"}
    t4={"Locations"} p4={"/LocationTourist"} t5={"Products"} p5={"/ProductTourist"} t6={"Logout"} p6={"/"}/>    
    </>
  )
}

export default TouristNavBar;