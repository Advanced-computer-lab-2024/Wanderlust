import React from 'react'
import ViewNotifications from '../Components/Admin/ViewNotifications'
import Navbar from '../Components/Navbar'
const AdminViewNotifications = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <ViewNotifications/>
    </>
  )
}

export default AdminViewNotifications