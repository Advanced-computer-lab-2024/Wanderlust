import React from 'react'
import ViewPendingDocuments from '../Components/Admin/ViewPendingDocuments'
import Navbar from '../Components/Navbar'
const AdminManageProductsPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <ViewPendingDocuments/>
    </>
  )
}

export default AdminManageProductsPage