import React from 'react'
import Navbar from '../../Components/NavBars/SellerProductNavBar'; 
import SellerNavBar from '../../Components/NavBars/SellerNavBar'
import MyProducts from '../../Components/MyProducts';

const SellerMyProductsPage = () => {
    return (
    <>      
      <SellerNavBar />  
      <Navbar/>
      <MyProducts />
      {/* we might use the adminproducts component */}
    </>
    )
  }
  
  export default SellerMyProductsPage;