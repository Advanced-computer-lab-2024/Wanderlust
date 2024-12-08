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
    </>
  );
};

export default Home;
