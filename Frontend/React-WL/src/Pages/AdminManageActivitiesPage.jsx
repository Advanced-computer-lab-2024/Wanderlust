import React from 'react'
import Navbar from '../Components/Navbar'
import ManageActivities from '../Components/Admin/ManageActivities'
const AdminManageActivitiesPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <ManageActivities/>
    </>
  )
}

export default AdminManageActivitiesPage