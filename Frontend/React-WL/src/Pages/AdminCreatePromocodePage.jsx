import React from 'react'
import Navbar from '../Components/Navbar'
// import ManageActivities from '../Components/Admin/ManageActivities'
import CreatePromocode from '../Components/Admin/CreatePromocode'
const AdminManageActivitiesPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <CreatePromocode/>
    </>
  )
}

export default AdminManageActivitiesPage