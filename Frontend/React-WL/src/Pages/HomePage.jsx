import React from 'react';
import GuestNavBar from '../Components/NavBars/GuestNavBar';
import Hero from '../Components/Hero';
import Carousel from '../Components/Carousel';
import Whatexpect from '../Components/Whatexpect';

const Home = () => {
  return (
    <>
      <GuestNavBar />
      <Hero />
      <Carousel />
      <Whatexpect />
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
  );
};

export default Home;
