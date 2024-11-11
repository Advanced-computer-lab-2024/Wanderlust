import React from 'react'
import Activities from '../../Components/Activities'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const ActivityTourist = () => {
    return (
      <>

      <TouristNavBar  />
      
      <Activities showCreateButton={false} showDeleteButton={false} showUpdateButton={false} guestMode={false} />
      
  
     
      </>
    )
  }
  
  export default ActivityTourist