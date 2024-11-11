import React from 'react'
import Activities from '../../Components/Activities'
import GuestNavbar from '../../Components/NavBars/GuestNavBar'

const Advertiser = () => {
  return (
    <>
      <GuestNavbar />
    <Activities guestMode={true} />

    </>
  )
}

export default Advertiser