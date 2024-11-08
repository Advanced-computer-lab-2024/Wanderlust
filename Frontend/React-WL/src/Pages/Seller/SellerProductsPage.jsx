import React from 'react'

import SellerNavBar from '../../Components/NavBars/SellerNavBar'
import SellerProducts from '../../Components/SellerProducts';

const SellerProductsPage = () => {
    return (
    <>      
      <SellerNavBar />  
      <SellerProducts />
      {/* we might use the adminproducts component */}
    </>
    )
  }
  
  export default SellerProductsPage;