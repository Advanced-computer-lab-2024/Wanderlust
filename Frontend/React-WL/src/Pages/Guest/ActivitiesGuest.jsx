import React from 'react'
import Activities from '../../Components/Activities'
import GuestNavbar from '../../Components/NavBars/GuestNavBar'

const ActivitiesGuest = () => {
  return (
    <>
      <GuestNavbar />

      <Activities showCreateButton={false} showUpdateButton={false} showDeleteButton={false} />

    </>
  )
}

export default ActivitiesGuest