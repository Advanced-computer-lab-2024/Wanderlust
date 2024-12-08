import React from 'react'
import AdvertiserNavBar from '../../Components/NavBars/AdvertiserNavBar'
import Activities from '../../Components/Activities';

const AdvertiserActivitiesPage = () => {
    return (
    <>      
      <AdvertiserNavBar /> 
      <Activities showBookButton={false} showBookmark={false} showCreateButton={true} showUpdateButton={true} showDeleteButton={true}/>
    </>
    )
  }
  
  export default AdvertiserActivitiesPage;