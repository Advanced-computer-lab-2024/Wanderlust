import React from 'react'
import SellerNavBar from '../../Components/NavBars/SellerNavBar'
import SellerSales from '../../Components/Seller-Sales'
import Seller from '../../Components/SellerProducts'

const SalesReportSeller = () => {
  return (<>
    <SellerNavBar />
    <SellerSales />
    
    <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
  )
}

export default SalesReportSeller