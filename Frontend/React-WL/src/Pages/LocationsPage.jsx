import React from 'react'
import Navbar from '../Components/Navbar'
import Activities from '../Components/Activities'
import GuestNavbar from '../Components/NavBars/GuestNavBar'
import LocationList from '../Components/LocationList'
const LocationsPage = () => {
  return (
    <>
    <GuestNavbar />
    <LocationList />
    </>
  );
}

export default LocationsPage;