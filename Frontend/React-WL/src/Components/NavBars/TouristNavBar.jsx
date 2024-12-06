import React from 'react'
import Navbar from '../Navbar'

const TouristNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/TouristProfile"} t2={"Itineraries"} p2={"/ItineraryTourist"} t3={"Activities"} p3={"/ActivityTourist"}
    t4={"Historical Places"} p4={"/LocationTourist"} t5={"Products"} p5={"/ProductTourist"} t6={"Logout"} p6={"/"} t7={"Bookings"} p7={"/BookingsTourist"} t8={""} p8={"/"} t9={"OrderHistory"} p9={"/TouristOrders"}  t10={"Wishlist"} p10={"/TouristWishlist"} t11={"Cart"} p11={"/TouristCart"} t12={"Notifications"} p12={"/"}/>    
    </>
  )
}

export default TouristNavBar;