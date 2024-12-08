import React from 'react'
import Activities from '../../Components/Activities'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const ActivityTourist = () => {
    return (
      <>
      <TouristNavBar  />
      
      <Activities showCreateButton={false} showDeleteButton={false} showUpdateButton={false} guestMode={false} />
      
  
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
      </>
    )
  }
  
  export default ActivityTourist