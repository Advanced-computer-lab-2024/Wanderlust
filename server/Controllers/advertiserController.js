const Advertiser = require('../Models/Advertiser.js');
const Activity = require('../Models/Activity.js');
const { default: mongoose, get } = require('mongoose');

const createAdvertiser = async (req, res) => {
  const { username,companyWebsite, companyProfile, hotline } = req.body;

  try {
      const advertiser = await Advertiser.create({ username, companyWebsite, companyProfile, hotline });
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

const updateAdvertiser = async (req, res) => {
  const { username } = req.body; 
  const { companyWebsite, companyProfile, hotline } = req.body;

  console.log('Updating advertiser:', { username, companyWebsite, companyProfile, hotline });

  try {
      const updatedAdvertiser = await Advertiser.findOneAndUpdate(
        {username},
          { companyWebsite, companyProfile, hotline },
          { new: true, runValidators: true } 
      );
      
      res.status(200).json(updatedAdvertiser);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
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

const createActivity = async (req, res) => {
  const { date, time, location, price, category, tags, specialDiscounts, bookingOpen } = req.body;

  try {
    const activity = await Activity.create({ date, time, location, price, category, tags, specialDiscounts, bookingOpen });
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.body;
  const { date, time, location, price, category, tags, specialDiscounts, bookingOpen } = req.body;

  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { date, time, location, price, category, tags, specialDiscounts, bookingOpen },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.body;

  try {
    await Activity.findByIdAndDelete(id);
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAdvertiser,
  getAdvertiser,
  updateAdvertiser,
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity
};