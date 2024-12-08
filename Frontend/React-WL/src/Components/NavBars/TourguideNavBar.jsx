import React from 'react'
import Navbar from '../Navbar'

const TourguideNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/Tgprofile"} t2={"Itineraries"} p2={"/ItineraryTourguide"}  t4={"View Sales"} p4={"/SalesReportTourGuide"} 
    t6={"Logout"} p6={"/"}/>    
    </>

  )
}

export default TourguideNavBar;