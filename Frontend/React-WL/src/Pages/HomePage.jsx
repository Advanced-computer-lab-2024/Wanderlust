import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import HomeCards from '../Components/HomeCards'
import Activities from '../Components/Activities'
import ItineraryList from '../Components/ItineraryList'
import Advertiser from './Advertiser'

const Home = () => {
  return (
    <>
   

   <Navbar t1={"Tour guide"} p1={"/Tourguide"} t2={"Advertiser"} p2={"/advertiser"} t3={"Seller"} p3={"/a"} t4={"Tourism Govener"} p4={"/a"} t5={"Tourist"} p5={"/a"} t6={"Login"} p6={"/Login"} />
    <Hero />
    <HomeCards />
    <Activities />
    
 

   

    <section className="m-auto max-w-lg my-10 px-6">
      <a
        href="jobs.html"
        className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >View All</a
      >
    </section>

</>
  )
}

export default Home