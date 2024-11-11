import React from 'react'
import Navbar from '../Navbar'

const TourguideNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/Tgprofile"} t2={"Itineraries"} p2={"/ItineraryTourguide"} t3={"Activities"} p3={"/ActivityTourguide"}
    t6={"Logout"} p6={"/"}/>    
    </>

  )
}

export default TourguideNavBar;