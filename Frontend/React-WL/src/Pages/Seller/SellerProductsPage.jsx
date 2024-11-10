import React from 'react'
import Navbar from '../../Components/NavBars/SellerProductNavBar'; 
import SellerNavBar from '../../Components/NavBars/SellerNavBar'
import SellerProducts from '../../Components/SellerProducts';

const SellerProductsPage = () => {
    return (
    <>      
      <SellerNavBar />  
      <Navbar/>
      <SellerProducts />
      {/* we might use the adminproducts component */}
    </>
    )
  }
  
  export default SellerProductsPage;