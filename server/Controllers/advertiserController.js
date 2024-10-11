const Advertiser = require("../Models/Advertiser.js");
const Activity = require("../Models/Activity.js");
const { default: mongoose, get } = require("mongoose");

const createAdvertiser = async (req, res) => {
  const { username, email, password, mobileNumber, website, companyProfile, hotline, termsAccepted } = req.body;

  if (!termsAccepted) {
    return res.status(400).json({ error: "Terms and conditions must be accepted." });
  }

  try {
    const advertiser = await Advertiser.create({
      username, email, password, mobileNumber, website, companyProfile, hotline, termsAccepted,role: 'advertiser'  });
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAdvertiser = async (req, res) => {
  try {
    const advertisers = await Advertiser.find();
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAdvertiserByUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const advertiser = await Advertiser.findOne({ username });
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAdvertiser = async (req, res) => {
  const { username } = req.body;
  const { companyWebsite, companyProfile, hotline } = req.body;

  console.log("Updating advertiser:", {
    username,
    companyWebsite,
    companyProfile,
    hotline,
  });

  try {
    const updatedAdvertiser = await Advertiser.findOneAndUpdate(
      { username },
      { companyWebsite, companyProfile, hotline },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedAdvertiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAdvertiser,
  getAdvertiser,
  getAdvertiserByUsername,
  updateAdvertiser,
};

// const deleteAdvertiser = async (req, res) => {
//   const { username } = req.params;

//   try {
//       await Advertiser.findOneAndDelete(username);
//       res.status(200).json({ message: 'Advertiser deleted successfully' });
//   } catch (error) {
//       res.status(400).json({ error: error.message });
//   }
// };
