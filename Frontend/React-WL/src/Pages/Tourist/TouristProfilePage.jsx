import React from 'react'

import TouristProfile from '../../Components/TouristProfile'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const TouristProfilePage = () => {
  return (
    <>
    

        <TouristNavBar  />
        <TouristProfile />



        <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
  )
}

export default TouristProfilePage