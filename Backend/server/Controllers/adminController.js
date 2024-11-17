const adminModel = require("../Models/Admin.js");
const tourismGovernorModel = require("../Models/TourismGovernor.js");
const tourguideModel = require("../Models/tourGuide");
const touristModel = require("../Models/Tourist.js");
const advertiserModel = require("../Models/Advertiser");
const sellerModel = require("../Models/Seller.js");
const User = require("../Models/user");
//npm install jsonwebtoken
const jwt = require("jsonwebtoken");

// Get admin details by username
const getAdminDetails = async (req, res) => {
  try {
    const { username } = req.query;
    const adminAccount = await adminModel.findOne({ username });

    if (adminAccount) {
      res.status(200).json({
        id: adminAccount._id,
        name: adminAccount.name,
        email: adminAccount.email,
        username: adminAccount.username,
      });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    const existingAdmin = await adminModel.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newAdmin = new adminModel({ name, email, password, username });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//deleting account based on the id
const deleteAccount = async (req, res) => {
  const { id } = req.body;

  try {
    let account =
      (await adminModel.findById(id)) ||
      (await tourismGovernorModel.findById(id)) ||
      (await tourguideModel.findById(id)) ||
      (await touristModel.findById(id)) ||
      (await advertiserModel.findById(id)) ||
      (await sellerModel.findById(id)) ||
      (await User.findById(id));

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    await account.deleteOne();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// helper get all usernames on system and account type
const getAllUserDetails = async (req, res) => {
  try {
    const adminAccounts = await adminModel.find(
      {},
      "_id username email password role"
    );
    const tourismGovernorAccounts = await tourismGovernorModel.find(
      {},
      "_id username email password role"
    );
    const userAccounts = await User.find(
      {},
      "_id username email password role"
    );

    const accounts = [
      ...adminAccounts.map((account) => ({
        id: account._id,
        username: account.username,
        email: account.email,
        password: account.password,
        accountType: "admin",
      })),
      ...tourismGovernorAccounts.map((account) => ({
        id: account._id,
        username: account.username,
        email: account.email,
        password: account.password,
        accountType: "tourismGovernor",
      })),
      ...userAccounts.map((account) => ({
        id: account._id,
        username: account.username,
        email: account.email,
        password: account.password,
        accountType: account.role,
      })),
    ];
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all pending users
const getPendingUsers = async (req, res) => {
  try {
    const pendingAdvertisers = await advertiserModel
      .find({ roleApplicationStatus: "pending" })
      .populate("userId");
    const pendingSellers = await sellerModel
      .find({ roleApplicationStatus: "pending" })
      .populate("userId");
    const pendingTourGuides = await tourguideModel
      .find({ roleApplicationStatus: "pending" })
      .populate("userId");
    res.status(200).json({
      pendingAdvertisers,
      pendingSellers,
      pendingTourGuides,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const approvePendingUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType, status } = req.body;
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ message: "Invalid status" });
    }
    let user;
    if (userType === "Advertiser") {
      user = await advertiserModel.findOne({ userId });
    } else if (userType === "Seller") {
      user = await sellerModel.findOne({ userId });
    } else if (userType === "TourGuide") {
      user = await tourguideModel.findOne({ userId });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }
    const actualUser = await User.findById({ _id: userId });
    if (actualUser) {
      actualUser.roleApplicationStatus = status;
      await actualUser.save();
    } else {
      return res.status(404).json({ message: "User not found" });
    }
    if (user) {
      user.roleApplicationStatus = status;
      await user.save();
      if (status === "approved") {
        return res.status(200).json({ message: "User approved successfully" });
      } else{
      return res.status(200).json({ message: "User rejected successfully" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Create a new tourism governor
const addTourismGovernor = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingGovernor = await tourismGovernorModel.findOne({ username });
    if (existingGovernor) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newGovernor = new tourismGovernorModel({ username, password });
    await newGovernor.save();
    res.status(201).json({ message: "Tourism governor created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createAdmin,
  addTourismGovernor,
  deleteAccount,
  getAllUserDetails,
  getAdminDetails,
  getPendingUsers,
  approvePendingUser,
};
