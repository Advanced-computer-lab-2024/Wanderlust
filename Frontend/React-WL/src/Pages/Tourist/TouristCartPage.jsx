import BookingsTourist from "../../Components/BookingsTourist";
import TouristNavBar from "../../Components/NavBars/TouristNavBar";
import TouristCart from "../../Components/TouristCart";
import AddDeliveryAddress from "../../Components/AddDeliveryAddress";
const TouristCartPage = () => {
  return (
    <>
      <TouristNavBar />
      <TouristCart />
      <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
  );
};

export default TouristCartPage;
