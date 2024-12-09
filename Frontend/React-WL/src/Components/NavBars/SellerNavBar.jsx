import React from 'react'
import Navbar from '../Navbar'

const SellerNavBar = () => {
  return (
    <>
    <Navbar t1={"Profile"} p1={"/SellerProfile"} t2={"Products"} p2={"/SellerProducts"}  t3={"View Sales"} p3={"/SalesReportSeller"} t6={"Logout"} p6={"/"}/>    
    </>

  )
}

export default SellerNavBar;