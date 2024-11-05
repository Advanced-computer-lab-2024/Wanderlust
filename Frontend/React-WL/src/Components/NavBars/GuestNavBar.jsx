import React from 'react'
import Navbar from '../Navbar'

const GuestNavBar = () => {
  return (
    <>
    <Navbar t1={"Itineraries"} p1={"/Itinerary"} t2={"Activities"} p2={"/activitiesPage"} t3={"Locations"} p3={"/LocationPage"}
     t4={"Login"} p4={"/login"} t6={"Sign Up"} p6={"/Register"}/>    
    </>
  )
}

export default GuestNavBar;