import React from 'react'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import HomeCards from './Components/HomeCards'
import Activities from './Components/Activities'
import ItineraryList from './Components/ItineraryList'

const App = () => {
  return (
    <>
   

    <Navbar />
    <Hero />
    <HomeCards />
    <Activities />
    <ItineraryList />
 

   

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

export default App