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

<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>

      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
    )
  }
  
  export default SellerProductsPage;