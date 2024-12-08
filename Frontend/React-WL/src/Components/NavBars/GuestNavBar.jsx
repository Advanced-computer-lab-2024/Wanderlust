import React from 'react'
import Navbar from '../Navbar'

const GuestNavBar = () => {
  return (
    <>
    <Navbar t1="Home" p1="/" t2={"Itineraries"} p2={"/Itinerary"} t3={"Activities"} p3={"/activitiesGuest"} t4={"Whereabouts"} p4={"/LocationPage"}
     t5={"Login"} p5={"/login"} t6={"Sign Up"} p6={"/Register"}/>    
    </>
  )
}

export default GuestNavBar;