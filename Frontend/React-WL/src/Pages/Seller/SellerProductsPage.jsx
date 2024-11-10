import React from 'react'
import Navbar from '../../Components/NavBars/SellerProductNavBar'; 
import SellerNavBar from '../../Components/NavBars/SellerNavBar'
import SellerProducts from '../../Components/SellerProducts';
import ManageProducts from '../../Components/Admin/ManageProducts';
const SellerProductsPage = () => {
    return (
    <>      
      <SellerNavBar />  
      <ManageProducts />
      {/* we might use the adminproducts component */}
    </>
    )
  }
  
  export default SellerProductsPage;