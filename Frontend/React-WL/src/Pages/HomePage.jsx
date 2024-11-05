import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import HomeCards from '../Components/HomeCards'
import Activities from '../Components/Activities'
import ItineraryList from '../Components/ItineraryList'
import TourGuideProfile from '../Components/TourGuideProfile'
import Advertiser from './Advertiser'
import GuestNavBar from '../Components/NavBars/GuestNavBar'

const Home = () => {
  return (
  <>
      <GuestNavBar />
      <Hero />
      <Activities showCreateButton={false}
          showUpdateButton={false}
          showDeleteButton={false} />
  </>
  )
}
export default Home