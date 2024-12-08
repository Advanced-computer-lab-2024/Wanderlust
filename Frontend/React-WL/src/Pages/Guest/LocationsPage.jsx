import React from 'react'
import Navbar from '../../Components/Navbar'
import Activities from '../../Components/Activities'
import GuestNavbar from '../../Components/NavBars/GuestNavBar'
import LocationList from '../../Components/LocationList'
const LocationsPage = () => {
  return (
    <>
    <GuestNavbar />
    <LocationList />
    <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
  
    </>
  );
}

export default LocationsPage;