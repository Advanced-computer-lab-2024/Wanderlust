import React from 'react'
import TourismGovernorNavBar from '../../Components/NavBars/TourismGovernorNavBar'
import TourismGovernorLocations from '../../Components/TourismGovernorLocations';

const TourismGovernorLocationsPage = () => {
    return (
    <>      
      <TourismGovernorNavBar /> 
      <TourismGovernorLocations />
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
    )
  }
  
  export default TourismGovernorLocationsPage;