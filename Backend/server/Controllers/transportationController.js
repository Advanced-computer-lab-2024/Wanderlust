const TransportationBookingModel = require('../Models/transportationBooking');  // Assuming the Booking model exists
const AdvertiserModel = require('../Models/Advertiser');  // Assuming the Advertiser model exists
const TouristModel = require('../Models/Tourist');  // Assuming the Tourist model exists


  // Book transportation based only on advertiserId and touristId
  const bookTransportation = async (req, res) => {
    try {
      const { advertiserId, touristId } = req.body;
      if (!advertiserId || !touristId) {
        return res
          .status(400)
          .json({ message: "Please provide advertiser ID and tourist ID" });
      }
      const advertiser = await AdvertiserModel.findById(advertiserId);
      if (!advertiser) {
        return res.status(404).json({ message: "advertiser not found" });
      }
      const tourist = await TouristModel.findById(touristId);
      if (!tourist) {
        return res.status(404).json({ message: "tourist not found" });
      }
      const transportationBooking = await TransportationBookingModel.findOne({ advertiserId, touristId });
      if (transportationBooking) {
        return res
          .status(400)
          .json({ message: "You have already booked this transportation" });
      }
      // Create a new booking
      const newTransportationBooking = new TransportationBookingModel({
        advertiserId,
        touristId,
      });
  
      await newTransportationBooking.save(); // Save to the database
  
      res
        .status(201)
        .json({ message: "Booking successful!", advertiserId, touristId });
    } catch (error) {
      console.error("Error booking transportation:", error);
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {bookTransportation};

