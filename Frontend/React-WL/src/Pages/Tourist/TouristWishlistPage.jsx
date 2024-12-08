import TouristNavBar from '../../Components/NavBars/TouristNavBar'
import TouristWishlist from '../../Components/TouristWishlist'
const TouristWishlistPage = () => {
    return (
        <>
        <TouristNavBar />
        <TouristWishlist />
        <div className="bg-custom text-white py-4 shadow-inner text-center ">
           <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
           <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
         </div>
           
        </>
        
    );
};

export default TouristWishlistPage;