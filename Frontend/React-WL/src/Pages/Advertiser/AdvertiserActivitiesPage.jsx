import React from 'react'
import AdvertiserNavBar from '../../Components/NavBars/AdvertiserNavBar'
import Activities1 from '../../Components/Activities1';

const AdvertiserActivitiesPage = () => {
    return (
    <>      
      <AdvertiserNavBar /> 
      <Activities1 showBookButton={false} showBookmark={false} showCreateButton={true} showUpdateButton={true} showDeleteButton={true}/>
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
  
    </>
    )
  }
  
  export default AdvertiserActivitiesPage;