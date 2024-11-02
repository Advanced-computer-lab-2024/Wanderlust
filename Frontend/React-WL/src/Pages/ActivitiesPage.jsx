import React from 'react'
import Navbar from '../Components/Navbar'
import Activities from '../Components/Activities'


const Advertiser = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/advProfile"} t2={"Activities"}  p2={"/ActivitiesPage"}  />
    <Activities />

    </>
  )
}

export default Advertiser