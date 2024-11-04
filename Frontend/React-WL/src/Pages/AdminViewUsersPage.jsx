import React from 'react'
import ViewUsers from '../Components/Admin/ViewUsers'
import Navbar from '../Components/Navbar'
const AdminViewUsersPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <ViewUsers/>
    </>
  )
}

export default AdminViewUsersPage