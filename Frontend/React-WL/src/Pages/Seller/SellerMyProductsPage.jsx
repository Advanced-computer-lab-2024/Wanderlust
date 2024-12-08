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
      
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
  
    </>

    )
  }
  
  export default SellerMyProductsPage;