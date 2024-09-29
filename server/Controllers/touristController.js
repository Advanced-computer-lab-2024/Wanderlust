const touristModel = require("../Models/Tourist");
const { default: mongoose } = require("mongoose");

const getTourist = async (req, res) => {
  const username = req.body.username;
  const tourist = await touristModel.findOne({ username: username });
  res.status(200).json(tourist);
};

const createTourist = async (req, res) => {
  const {
    username,
    email,
    password,
    mobileNumber,
    nationality,
    dateOfBirth,
    job,
  } = req.body;
  try {
    const tourist = await touristModel.create({
      username,
      email,
      password,
      mobileNumber,
      nationality,
      dateOfBirth,
      job,
    });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourist = async (req, res) => {
  try {
    const touristId = req.params.touristId;
    const {
      username,
      email,
      password,
      mobileNumber,
      nationality,
      dateOfBirth,
      job,
    } = req.body;
    const tourist = await touristModel.findByIdAndUpdate(
      touristId,
      {
        username,
        email,
        password,
        mobileNumber,
        nationality,
        dateOfBirth,
        job,
      },
      { new: true }
    );
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getTourist, createTourist, updateTourist };
