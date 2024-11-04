import React from 'react'
import Navbar from '../Components/Navbar'
import ManagePreferenceTags from '../Components/Admin/ManagePreferenceTags'
const AdminManagePreferenceTagsPage = () => {
  return (
    <>
    <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Login"} p6={"/Login"}/>
    <ManagePreferenceTags/>
    </>
  )
}

export default AdminManagePreferenceTagsPage