import React from 'react'
import Navbar from '../Navbar'
import { Bell } from 'lucide-react'

const TourguideNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/Tgprofile"} t2={"Itineraries"} p2={"/ItineraryTourguide"}  t4={"View Sales"} p4={"/SalesReportTourGuide"}  
    t5={<Bell size={24} />} p5={"/TourguideNotifications"} t6={"Logout"} p6={"/"}/>    
    </>
  )
}

export default TourguideNavBar;