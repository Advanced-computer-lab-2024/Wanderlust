import React from 'react'
import Activities from '../../Components/Activities'
import TouristNavBar from '../../Components/NavBars/TouristNavBar'

const ActivityTourist = () => {
    return (
      <>
      
      
      <TouristNavBar  />
      
      <Activities showCreateButton={false} showUpdateButton={false} showDeleteButton={false}/>
      
  
     
      </>
    )
  }
  
  export default ActivityTourist