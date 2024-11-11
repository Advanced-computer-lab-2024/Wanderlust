import React from 'react'
import Navbar from '../Components/Navbar'
import FlagItinerary from '../Components/Admin/FlagItinerary'
const AdminManageActivitiesPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <FlagItinerary/>
    </>
  )
}

export default AdminManageActivitiesPage