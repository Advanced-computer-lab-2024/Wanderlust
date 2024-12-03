import React from 'react'
import Navbar from '../Navbar'

const TourguideNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/Tgprofile"} t2={"Itineraries"} p2={"/ItineraryTourguide"} t3={"Activities"} p3={"/ActivityTourguide"} t4={"View Sales"} p4={"/SalesReportTourGuide"} t5={"Settings"} p5={"/Settings"}
    t6={"Logout"} p6={"/"}/>    
    </>

  )
}

export default TourguideNavBar;