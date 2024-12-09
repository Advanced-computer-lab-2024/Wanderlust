import React from 'react'
import ViewSalesReport from '../Components/Admin/ViewSalesReport'
import Navbar from '../Components/Navbar'
const AdminViewSalesReport = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <ViewSalesReport/>
    </>
  )
}

export default AdminViewSalesReport