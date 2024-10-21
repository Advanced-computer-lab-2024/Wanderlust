const TourGuide = require("../Models/tourGuide");
const User = require("../Models/user");

const createTourGuide = async (req, res) => {
  const { userId } = req.params;
  const { YOE, previousWork } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tourGuide = new TourGuide({
      userId: user._id,
      YOE,
      previousWork,
    });
    user.role = "tour guide";
    user.roleApplicationStatus = "pending";
    await tourGuide.save();
    await user.save();
    res.status(200).json({
      user,
      tourGuide,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createTourGuide };