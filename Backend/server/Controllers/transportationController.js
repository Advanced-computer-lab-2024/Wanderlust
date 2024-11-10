const transportationService = require('../services/transportationService');

class TransportationController {
  // Book transportation
  async book(req, res) {
    const { transportationId, numSeats } = req.body;
    const userId = req.user.id;  // Assuming the user is authenticated

    try {
      const transportation = await transportationService.bookTransportation(transportationId, userId, numSeats);
      res.status(200).json({ message: 'Booking successful', transportation });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TransportationController();
