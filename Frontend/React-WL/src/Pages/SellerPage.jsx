import React from 'react'
import Navbar from '../Components/Navbar'
import Seller from '../Components/Seller'
const SellerPage = () => {
  return (
    <>
   <Navbar t1={"Tour guide"} p1={"/tourguide"} t2={"Advertiser"} p2={"/a"} t3={"Seller"} p3={"/seller"} t4={"Tourism Govener"} p4={"/a"} t5={"Tourist"} p5={"/a"} t6={"Login"} p6={"/Login"} />

    <Seller/>
    </>
  )
}

export default SellerPage