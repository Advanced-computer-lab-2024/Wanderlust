import Navbar from '../Components/Navbar'
import Itineraries from '../Components/Itinerary-nobuttons'
import Activities from '../Components/Activities'
import Locations from '../Components/LocationList'

const ItineraryTourist = () => {
  return (
    <>
    
    <Navbar t1={"Profile"} p1={"/tgProfile"} t2={"Itineraries"} p2={"/ItineraryTourist"} t3={"Activities"} p3={"/ActivityTourist"}
    t4={"Locations"} p4={"/LocationTourist"} t5={"Products"} p5={"/ProductTourist"}/>
    <Itineraries />
    


   
    </>
  )
}

export default ItineraryTourist