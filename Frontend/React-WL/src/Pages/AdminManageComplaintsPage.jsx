import React from 'react'
import Navbar from '../Components/Navbar'
import ManageComplaints from '../Components/Admin/ManageComplaints'
const AdminManageActivitiesPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Login"} p6={"/Login"}/>
    <ManageComplaints/>
    </>
  )
}

export default AdminManageActivitiesPage