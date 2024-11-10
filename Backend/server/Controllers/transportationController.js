const Booking = require('../Models/Booking');  // Assuming the Booking model exists
const Advertiser = require('../Models/Advertiser');  // Assuming the Advertiser model exists
const Tourist = require('../Models/Tourist');  // Assuming the Tourist model exists

class TransportationController {
  // Book transportation based only on advertiserId and touristId
  async book(req, res) {
    const { advertiserId, touristId } = req.body;  // Get advertiserId and touristId from request body
    const userId = req.user.id;  // Assuming the user is authenticated, using req.user.id for tourist

    try {
      // Check if the advertiser and tourist exist
      const advertiser = await Advertiser.findById(advertiserId);
      const tourist = await Tourist.findById(touristId);

      if (!advertiser) {
        return res.status(404).json({ error: 'Advertiser not found' });
      }
      
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }

      // Create a new booking for the tourist and advertiser
      const newBooking = await Booking.create({
        advertiserId,    // The advertiser providing the transportation
        touristId,       // The tourist making the booking
      });

      // Return the successful booking response
      res.status(200).json({
        message: 'Booking successful',
        booking: newBooking,
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TransportationController();

