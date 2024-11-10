import React from 'react'
import UpdateAdminPassword from '../Components/Admin/UpdateAdminPassword'
import Navbar from '../Components/Navbar'
const AdminManageProductsPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
    <UpdateAdminPassword/>
    </>
  )
}

export default AdminManageProductsPage