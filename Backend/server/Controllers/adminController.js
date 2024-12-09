const adminModel = require("../Models/Admin.js");
const tourismGovernorModel = require("../Models/TourismGovernor.js");
const tourguideModel = require("../Models/tourGuide");
const touristModel = require("../Models/Tourist.js");
const advertiserModel = require("../Models/Advertiser");
const sellerModel = require("../Models/Seller.js");
const User = require("../Models/user");
const PromoCode = require("../Models/PromoCode"); 
const Notification = require('../Models/Notification'); // Assuming you have a Notification model
const Advertiser = require("../Models/Advertiser.js");
const Activity = require("../Models/Activity.js");
const Itinerary = require("../Models/Itinerary.js");
const Products = require("../Models/Products.js");
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
const getUserStatistics = async (req, res) => {
  try {
    const adminAccounts = await adminModel.find({}, "createdAt");
    const tourismGovernorAccounts = await tourismGovernorModel.find({}, "createdAt");
    const userAccounts = await User.find({}, "createdAt");

    const allAccounts = [
      ...adminAccounts,
      ...tourismGovernorAccounts,
      ...userAccounts,
    ];

    const totalUsers = allAccounts.length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const usersThisMonth = allAccounts.filter(account => {
      const accountDate = new Date(account.createdAt);
      return accountDate.getMonth() === currentMonth && accountDate.getFullYear() === currentYear;
    }).length;

    const usersPerMonth = allAccounts.reduce((acc, account) => {
      const accountDate = new Date(account.createdAt);
      const monthYear = `${accountDate.getMonth() + 1}-${accountDate.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear]++;
      return acc;
    }, {});

    const totalMonths = Object.keys(usersPerMonth).length;
    const averageUsersPerMonth = totalMonths ? (totalUsers / totalMonths).toFixed(2) : 0;

    res.status(200).json({
      totalUsers,
      usersThisMonth,
      averageUsersPerMonth,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const getNotifications = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const notifications = await Notification.find({ userId: decoded.id }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Function to generate a random promo code
const generateRandomCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
const createPromoCode = async (req, res) => {
  try {
    const { code, discount } = req.body;

    if (!code || !discount) {
      return res.status(400).json({ message: 'Code and discount are required' });
    }

    const expiryDate = new Date(new Date().getFullYear(), 11, 31); // Set expiry date to the end of the current year

    const existingPromoCode = await PromoCode.findOne({ code });
    if (existingPromoCode) {
      // Update the expiry date and discount if the promo code has expired
      if (existingPromoCode.expiryDate < new Date()) {
        existingPromoCode.expiryDate = expiryDate;
        existingPromoCode.discount = discount;
        await existingPromoCode.save();
      }
    } else {
      // Create a new promo code if it doesn't exist
      const newPromoCode = new PromoCode({
        code,
        discount,
        expiryDate,
      });
      await newPromoCode.save();
    }

    res.status(201).json({ message: 'Promo code created/updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({}, 'code discount expiryDate');
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
const getAllSalesReport = async (req, res) => {
  try {
    // Fetch all advertisers, tour guides, and products
    const advertisers = await Advertiser.find().populate('userId', 'username');
    const tourGuides = await tourguideModel.find().populate('userId', 'username');
    const products = await Products.find().populate({
      path: 'seller',
      populate: {
        path: 'userId',
        select: 'username'
      }
    });

    let totalRevenue = 0;
    let appRevenue = 0;
    let allActivities = [];
    let allItineraries = [];
    let allProducts = [];

    // Fetch sales report for each advertiser
    for (const advertiser of advertisers) {
      const activities = await Activity.find({ advertiserId: advertiser._id });
      const advertiserRevenue = activities.reduce((sum, activity) => sum + (activity.price * activity.touristCount), 0);
      totalRevenue += advertiserRevenue;
      appRevenue += advertiserRevenue * 0.1; // 10% app rate
      allActivities = allActivities.concat(activities.map(activity => ({
        name: activity.name,
        creator: advertiser.userId.username,
      })));
    }

    // Fetch sales report for each tour guide
    for (const tourGuide of tourGuides) {
      const itineraries = await Itinerary.find({ creator: tourGuide._id });
      const tourGuideRevenue = itineraries.reduce((sum, itinerary) => sum + (itinerary.price * itinerary.touristCount), 0);
      totalRevenue += tourGuideRevenue;
      appRevenue += tourGuideRevenue * 0.1; // 10% app rate
      allItineraries = allItineraries.concat(itineraries.map(itinerary => ({
        title: itinerary.title,
        creator: tourGuide.userId.username,
      })));
    }

    // Fetch sales report for each product
    for (const product of products) {
      const productRevenue = product.sales.reduce((sum, sale) => sum + (product.price * sale.quantity), 0);
      totalRevenue += productRevenue;
      appRevenue += productRevenue * 0.1; // 10% app rate
      allProducts = allProducts.concat({
        name: product.name,
        creator: product.seller && product.seller.userId ? product.seller.userId.username : 'Unknown',
      });
    }

    res.status(200).json({
      totalRevenue,
      appRevenue,
      numberOfItineraries: allItineraries.length,
      numberOfActivities: allActivities.length,
      numberOfProducts: allProducts.length,
      itineraries: allItineraries,
      activities: allActivities,
      products: allProducts,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching all sales report:", error);
    res.status(500).json({ error: "Failed to fetch all sales report. Please try again later." });
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
  getUserStatistics,
  createPromoCode,
  getNotifications,
  getPromoCodes,
  getAllSalesReport,
};
