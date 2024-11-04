import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import HomeCards from '../Components/HomeCards'
import Activities from '../Components/Activities'
import ItineraryList from '../Components/ItineraryList'
import TourGuideProfile from '../Components/TourGuideProfile'
import Advertiser from './Advertiser'

const Home = () => {
  return (
  <>
    <Navbar t1={"Tour guide"} p1={"/Tourguide"} t2={"Advertiser"} p2={"/advertiser"} t3={"Seller"} p3={"/seller"} t4={"Tourism Govener"} p4={"/TourismGovernor"} t5={"Tourist"} p5={"/tourist"} t6={"Login"} p6={"/Login"} />
      <Hero />
      <Activities showCreateButton={false}
          showUpdateButton={false}
          showDeleteButton={false} />
  </>
  )
}
export default Home