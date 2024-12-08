import React from 'react'

import SellerProfile from '../../Components/SellerProfile'
import SellerNavBar from '../../Components/NavBars/SellerNavBar'

const SellerProfilePage = () => {
    return (
    <>      
      <SellerNavBar /> 
      <SellerProfile />


      
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
  
    </>
    )
  }
  
  export default SellerProfilePage;