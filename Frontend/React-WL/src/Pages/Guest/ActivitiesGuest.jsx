import React from 'react'
import Activities from '../../Components/Activities'
import GuestNavbar from '../../Components/NavBars/GuestNavBar'

const ActivitiesGuest = () => {
  return (
    <>
      <GuestNavbar />

      <Activities guestMode={true} showCreateButton={false} showUpdateButton={false} showDeleteButton={false} showBookButton={false} showBookmark={false} />

    </>
  )
}

export default ActivitiesGuest