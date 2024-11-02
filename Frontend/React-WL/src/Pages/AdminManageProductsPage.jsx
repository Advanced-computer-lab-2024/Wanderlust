import React from 'react'
import ManageProducts from '../Components/Admin/ManageProducts'
import Navbar from '../Components/Navbar'
const AdminManageProductsPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Login"} p6={"/Login"}/>
    <ManageProducts/>
    </>
  )
}

export default AdminManageProductsPage