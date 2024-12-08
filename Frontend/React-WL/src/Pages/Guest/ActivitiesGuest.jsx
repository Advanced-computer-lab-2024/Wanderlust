import React from 'react'
import Activities from '../../Components/Activities'
import GuestNavbar from '../../Components/NavBars/GuestNavBar'

const ActivitiesGuest = () => {
  return (
    <>
      <GuestNavbar />

      <Activities guestMode={true} showCreateButton={false} showUpdateButton={false} showDeleteButton={false} showBookButton={false} showBookmark={false} />
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
  
    </>
  )
}

export default ActivitiesGuest