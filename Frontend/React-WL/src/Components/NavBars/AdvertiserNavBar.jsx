import React from 'react'
import Navbar from '../Navbar'
import { Bell } from 'lucide-react'

const AdvertiserNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/AdvertiserProfile"} t2={"Activities"} p2={"/AdvertiserActivities"}  t4={"View Sales"} p4={"/SalesReportAdvertiser"}  
    t5={<Bell size={24} />} p5={"/AdvertiserNotifications"} t6={"Logout"} p6={"/"}/>    
    </>
  )
}

export default AdvertiserNavBar;