import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import HomeCards from '../Components/HomeCards'
import Activities from '../Components/Activities'

import GuestNavBar from '../Components/NavBars/GuestNavBar'

const Home = () => {
  return (
  <>
      <GuestNavBar />
      <Hero />
      <Activities showCreateButton={false}
          showUpdateButton={false}
          showDeleteButton={false}
          showBookButton={false}
          showBookmark={false} />
  </>
  )
}
export default Home