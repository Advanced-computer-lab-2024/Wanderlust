import React from 'react'
import Navbar from '../Components/Navbar'
import ViewProducts from '../Components/Admin/ViewProducts'
const AdminViewProducts = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <ViewProducts/>
    </>
  )
}

export default AdminViewProducts