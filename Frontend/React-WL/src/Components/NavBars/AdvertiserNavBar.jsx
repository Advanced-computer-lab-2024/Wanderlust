import React from 'react'
import Navbar from '../Navbar'

const AdvertiserNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/AdvertiserProfile"} t2={"Activities"} p2={"/AdvertiserActivities"}  t3={"View Sales"} p3={"/SalesReportAdvertiser"} t6={"Logout"} p6={"/"}/>    
    </>

  )
}

export default AdvertiserNavBar;