import React from 'react'
import AdvertiserNavBar from '../../Components/NavBars/AdvertiserNavBar'
import AdvertiserSales from '../../Components/Advertiser-sales'

const SalesReportAdvertiser = () => {
  return (<>
    <AdvertiserNavBar />
    <AdvertiserSales />
 
    <div className="bg-custom text-white py-4 shadow-inner text-center ">
    <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
    <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
  </div>
    </>
  )
}

export default SalesReportAdvertiser