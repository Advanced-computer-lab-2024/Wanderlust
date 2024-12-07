import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import Itinerary from "./Pages/Guest/Itinerary";
import AdminDashboard from "./Pages/AdminDashboard";
import AddAdminPage from "./Pages/AddAdminPage";
import AddTourismGovernorPage from "./Pages/AddTourismGovernorPage";
import AdminViewUsersPage from "./Pages/AdminViewUsersPage";
import AdminManageProductsPage from "./Pages/AdminManageProductsPage";
import AdminManageActivitiesPage from "./Pages/AdminManageActivitiesPage";
import AdminManagePreferenceTagsPage from "./Pages/AdminManagePreferenceTagsPage";
import AdminManageComplaintsPage from "./Pages/AdminManageComplaintsPage";
import ActivitiesGuest from "./Pages/Guest/ActivitiesGuest";
import ItineraryTourist from "./Pages/Tourist/ItineraryTourist";
import LocationTourist from "./Pages/Tourist/LocationTourist";
import ActivityTourist from "./Pages/Tourist/ActivityTourist";
import BookingActivityPage from "./Pages/Tourist/BookingActivityPage";
import BookingItineraryPage from "./Pages/Tourist/BookingItineraryPage";
import ProductTourist from "./Pages/Tourist/ProductTourist";
import Tgprofile from "./Pages/Tourguide/Tgprofile";
import Complaint from "./Components/Admin/Complaint";
import ComplaintsTouristPage from "./Pages/Tourist/ComplaintsTouristPage";
import TouristCartPage from "./Pages/Tourist/TouristCartPage";
import CartCheckoutPage from "./Pages/Tourist/CartCheckoutPage";
import TouristWishlistPage from "./Pages/Tourist/TouristWishlistPage";
import TouristProfilePage from "./Pages/Tourist/TouristProfilePage";
import LocationsPage from "./Pages/Guest/LocationsPage";
import ItineraryTourguidePage from "./Pages/Tourguide/ItineraryTourguidePage";
import ActivityTourguidePage from "./Pages/Tourguide/ActivityTourGuidePage";
import SellerProductsPage from "./Pages/Seller/SellerProductsPage";
import SellerProfilePage from "./Pages/Seller/SellerProfilePage";
import AdvertiserProfilePage from "./Pages/Advertiser/AdvertiserProfilePage";
import AdvertiserActivitiesPage from "./Pages/Advertiser/AdvertiserActivitiesPage";
import TourismGovernorLocationsPage from "./Pages/TourismGovernor/TourismGovrernorLocationsPage";
import TourismGovernorProfilePage from "./Pages/TourismGovernor/TourismGovrernorProfilePage";
import SellerMyProductsPage from "./Pages/Seller/SellerMyProductsPage";
import BookingTourist from "./Pages/Tourist/TouristBookingsPage";
import AdminViewDocuments from "./Pages/AdminViewDocuments";
import AdminUpdatePassword from "./Pages/AdminUpdatePassword";
import AdminManageItinerary from "./Pages/AdminManageItinerary";
import AdminViewNotifications from "./Pages/AdminViewNotifications";
import TouristOrdersPage from "./Pages/Tourist/TouristOrdersPage";
import TouristBookmarkPage from "./Pages/Tourist/TouristBookmarkPage";
import OrderDetailsPage from "./Pages/Tourist/OrderDetailsPage";
import SalesReportTourGuide from "./Pages/Tourguide/SalesReportTourGuide";
import SalesReportAdvertiser from "./Pages/Advertiser/SalesReportAdvertiser";
import SalesReportSeller from "./Pages/Seller/SalesReportSeller";
import AdminCreatePromocodePage from "./Pages/AdminCreatePromocodePage";
import Guide from "./Components/Guide";
import "./App.css";

const App = () => {
  const [showGuide, setShowGuide] = useState(false);

  const handleShowGuide = () => {
    // Toggle the guide visibility each time the button is clicked
    setShowGuide((prevState) => !prevState);
  };

  return (
    <Router>
      {/* Help button */}
      <div className="help-container">
        <button onClick={handleShowGuide} className="help-button">
          ?
        </button>
      </div>

      {showGuide && <Guide />}
      {/* <Navbar />  */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Admin Routes */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/addadmin" element={<AddAdminPage />} />
        <Route
          path="/addtourismgovernor"
          element={<AddTourismGovernorPage />}
        />
        <Route path="/viewusers" element={<AdminViewUsersPage />} />
        <Route path="/manageproducts" element={<AdminManageProductsPage />} />
        <Route
          path="/manageactivities"
          element={<AdminManageActivitiesPage />}
        />
        <Route
          path="/managepreferencetags"
          element={<AdminManagePreferenceTagsPage />}
        />
        <Route
          path="/managecomplaints"
          element={<AdminManageComplaintsPage />}
        />
        <Route path="/viewpendingdocuments" element={<AdminViewDocuments />} />
        <Route path="/AdminUpdatePassword" element={<AdminUpdatePassword />} />
        <Route
          path="/AdminManageItinerary"
          element={<AdminManageItinerary />}
        />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/viewnotifications" element={<AdminViewNotifications />} />
        <Route path="/createpromocode" element={<AdminCreatePromocodePage />} />

        {/* Tourist Routes */}
        <Route path="/ItineraryTourist" element={<ItineraryTourist />} />
        <Route path="/LocationTourist" element={<LocationTourist />} />
        <Route path="/ActivityTourist" element={<ActivityTourist />} />
        <Route path="/BookingActivityPage" element={<BookingActivityPage />} />
        <Route
          path="/BookingItineraryPage"
          element={<BookingItineraryPage />}
        />
        <Route path="/ProductTourist" element={<ProductTourist />} />
        <Route path="/ComplaintsTourist" element={<ComplaintsTouristPage />} />
        <Route path="/TouristProfile" element={<TouristProfilePage />} />
        <Route path="/BookingsTourist" element={<BookingTourist />} />
        <Route path="/TouristCart" element={<TouristCartPage />} />
        <Route path="/CartCheckoutPage" element={<CartCheckoutPage />} />
        <Route path="/TouristWishlist" element={<TouristWishlistPage />} />
        <Route path="/TouristOrders" element={<TouristOrdersPage />} />
        <Route path="/OrderDetails/:orderId" element={<OrderDetailsPage />} />
        <Route path="/TouristBookmarks" element={<TouristBookmarkPage />} />

        {/* Guest Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/LocationPage" element={<LocationsPage />} />
        <Route path="/activitiesGuest" element={<ActivitiesGuest />} />
        <Route path="/itinerary" element={<Itinerary />} />

        {/* Tourguide Routes */}
        <Route path="/Tgprofile" element={<Tgprofile />} />
        <Route
          path="/ItineraryTourguide"
          element={<ItineraryTourguidePage />}
        />
        <Route path="/ActivityTourguide" element={<ActivityTourguidePage />} />
        <Route
          path="/SalesReportTourGuide"
          element={<SalesReportTourGuide />}
        />

        {/* Seller Routes */}
        <Route path="/SellerProfile" element={<SellerProfilePage />} />
        <Route path="/SellerProducts" element={<SellerProductsPage />} />
        <Route path="/MySellerProducts" element={<SellerMyProductsPage />} />
        <Route path="/SalesReportSeller" element={<SalesReportSeller />} />

        {/* Advertiser Routes */}
        <Route path="/AdvertiserProfile" element={<AdvertiserProfilePage />} />
        <Route
          path="/AdvertiserActivities"
          element={<AdvertiserActivitiesPage />}
        />
        <Route
          path="/SalesReportAdvertiser"
          element={<SalesReportAdvertiser />}
        />

        {/* Tourism Governor Routes */}
        <Route
          path="/TourismGovernorProfile"
          element={<TourismGovernorProfilePage />}
        />
        <Route
          path="/TourismGovernorLocations"
          element={<TourismGovernorLocationsPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
