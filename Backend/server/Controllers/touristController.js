const Booking = require("../Models/Booking");
const touristModel = require("../Models/Tourist");
const locationsModel = require("../Models/Locations");
const activityModel = require("../Models/Activity");
const itineraryModel = require("../Models/Itinerary");
const Notification = require('../Models/Notification'); 
const Seller = require('../Models/Seller');
const { createNotification } = require('./NotificationController');

const Admin = require('../Models/Admin'); 

const { default: mongoose } = require("mongoose");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const ProductModel = require("../Models/Products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe Secret Key
const nodemailer = require('nodemailer'); 


const getTourist = async (req, res) => {
  const username = req.query.username;
  try {
    const tourist = await touristModel
      .findOne({ username: username })
      .populate("userId");
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTourist = async (req, res) => {
  const { userId } = req.params;
  const { nationality, DOB, jobOrStudent, currency } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tourist = new touristModel({
      userId: user._id,
      nationality,
      DOB,
      jobOrStudent,
      currency,
    });
    user.roleApplicationStatus = "approved";
    await tourist.save();
    res.status(200).json({
      tourist,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourist = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { username } = req.params;
    const { email, password, mobileNumber, currency, ...touristData } =
      req.body;

    // Find the User by username
    const user = await User.findOne({ username }).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    // Define fields to update in User
    const userUpdates = {};
    if (email) userUpdates.email = email;
    if (password) userUpdates.password = password;
    if (mobileNumber) userUpdates.mobileNumber = mobileNumber;

    // Update User within the session
    const updatedUser = await User.findByIdAndUpdate(user._id, userUpdates, {
      new: true,
      session,
    });

    // Define fields to update in Tourist
    const touristUpdates = { ...touristData };
    if (currency) touristUpdates.currency = currency;
    // Update Tourist within the session
    const updatedTourist = await touristModel
      .findOneAndUpdate({ userId: user._id }, touristUpdates, {
        new: true,
        session,
      })
      .populate("userId");

    if (!updatedTourist) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Tourist not found for this user" });
    }

    await session.commitTransaction();
    res.status(200).json({ updatedUser, updatedTourist });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

const viewAll = async (req, res) => {
  const { touristId } = req.query; // Get the tourist ID from query parameters
  try {
    const locations = await Location.find().populate("tags");
    const activities = await Activity.find()
      .populate("category")
      .populate("tags");
    const itineraries = await Itinerary.find().populate("activities");
    let currency = "EGP"; // Default currency
    if (touristId) {
      const tourist = await Tourist.findById(touristId);
      if (tourist && tourist.currency) {
        currency = tourist.currency; // Use tourist's preferred currency
      }
    }
    const convertedActivities = await Promise.all(
      activities.map(async (item) => {
        const convertedItem = item.toObject();
        convertedItem.price = await convertCurrency(
          convertedItem.price,
          currency,
          touristId
        );
        return convertedItem;
      })
    );

    res
      .status(200)
      .json({ locations, activities: convertedActivities, itineraries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const redeemPoints = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const tourist = await touristModel.findOne({ userId: user._id });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    let cash = Math.floor(tourist.points / 10000) * 100;

    // Convert cash to the preferred currency

    tourist.wallet += parseFloat(cash);
    tourist.points -= (cash / 100) * 10000;
    updateBadge(tourist);
    await tourist.save();

    res.status(200).json({ tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Utility function or a method in your Tourist model
const updatePointsOnPayment = async (touristId, amountPaid) => {
  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Determine the level based on current points
    let level;
    if (tourist.points <= 100000) level = 1;
    else if (tourist.points <= 500000) level = 2;
    else level = 3;

    // Calculate additional points based on level
    let pointsEarned;
    if (level === 1) pointsEarned = amountPaid * 0.5;
    else if (level === 2) pointsEarned = amountPaid * 1;
    else pointsEarned = amountPaid * 1.5;

    // Update total points
    tourist.points += pointsEarned;
    updateBadge(tourist);
    // Save changes
    await tourist.save();
    return res
      .status(200)
      .json({ points: tourist.points, badge: tourist.badge, level });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateBadge = (tourist) => {
  // Update the badge based on the new points total
  if (tourist.points <= 100000) tourist.badge = "Bronze";
  else if (tourist.points <= 500000) tourist.badge = "Silver";
  else tourist.badge = "Gold";
};

const addProductToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.header("Authorization");
    console.log(authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    console.log(authHeader);
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(product);

    if (tourist.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    tourist.wishlist.push(productId);
    await tourist.save();
    return res
      .status(200)
      .json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getWishlist = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel
      .findOne({ _id: decoded.id })
      .populate("wishlist");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    return res.status(200).json({ wishlist: tourist.wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getCart = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel
      .findOne({ _id: decoded.id })
      .populate("cart.product");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    return res.status(200).json({ cart: tourist.cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const productIndex = tourist.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(400).json({ message: "Product not in wishlist" });
    }

    tourist.wishlist.splice(productIndex, 1);
    await tourist.save();
    return res
      .status(200)
      .json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const quantityToAdd = Number(quantity);

    // Check if the requested quantity is available
    if (product.quantity < quantityToAdd) {
      return res.status(400).json({ message: `Only ${product.quantity} units of ${product.name} are available` });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      const newQuantity = tourist.cart[cartItemIndex].quantity + quantityToAdd;
      if (newQuantity > product.quantity) {
        return res.status(400).json({ message: `Only ${product.quantity} units of ${product.name} are available` });
      }
      tourist.cart[cartItemIndex].quantity = newQuantity;
    } else {
      tourist.cart.push({ product: productId, quantity: quantityToAdd });
    }

    await tourist.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//remove product from cart
const removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      tourist.cart.splice(cartItemIndex, 1);
      await tourist.save();
      return res
        .status(200)
        .json({ message: "Product removed from cart successfully" });
    } else {
      return res.status(400).json({ message: "Product not in cart" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//chnage quantity of product in cart
const changeCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({ message: `Only ${product.quantity} units of ${product.name} are available` });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      tourist.cart[cartItemIndex].quantity = quantity;
      await tourist.save();
      return res
        .status(200)
        .json({ message: "Cart item quantity updated successfully" });
    } else {
      return res.status(400).json({ message: "Product not in cart" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const processPayment = async (totalAmount, touristId, paymentMethod) => {
  try {
    const tourist = await touristModel.findById(touristId);
    if (paymentMethod === "wallet") {
      // Wallet payment
      if (tourist.wallet < totalAmount) {
        return { success: false, message: "Insufficient wallet balance" };
      }

      // Deduct from wallet and update booking
      tourist.wallet -= totalAmount;
      await tourist.save();

      // Update points on payment
      await updatePointsOnPayment(touristId, totalAmount);

      // Update badge
      updateBadge(tourist);
      await tourist.save();

      return { success: true, message: "Payment successful using wallet" };
    } else if (paymentMethod === "card") {
      // Stripe payment
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount * 100, // Convert to cents
          currency: tourist.currency,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
          },
        });
        return {
          success: true,
          clientSecret: paymentIntent.client_secret,
          message: "Payment processing successful",
        };
      } catch (error) {
        return {
          success: false,
          message: "Payment processing failed",
          error: error.message,
        };
      }
    } else {
      return { success: false, message: "Invalid payment method" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
//checkout my order
/*
  need to implement a payment processing function @ali Mousa 
  for amgad edit this when Ali is done with payment processing function 
*/
const checkoutOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel
      .findOne({ _id: decoded.id })
      .populate("cart.product");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (tourist.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    tourist.cart.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    // Assuming you have a payment processing function
    const paymentResult = await processPayment(
      totalAmount,
      tourist._id,
      paymentMethod
    );
    if (!paymentResult.success) {
      return res
        .status(400)
        .json({ message: paymentResult.message, totalAmount });
    }
    if (paymentMethod === "card" && paymentResult.clientSecret) {
      return res.json({
        clientSecret: paymentResult.clientSecret,
        message: "Proceed with card payment",
        totalAmount,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const testOutOfStockNotification = async (req, res) => {
  try {
    const { adminId } = req.body;

    // Create a notification for the specified admin
    if (adminId) {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      const message = `This is a test notification for out of stock products.`;
      await createNotification(adminId, message, 'admin');
    } else {
      // Create a notification for all admins if no specific adminId is provided
      const adminUsers = await Admin.find({});
      const message = `This is a test notification for out of stock products.`;

      for (const admin of adminUsers) {
        await createNotification(admin._id, message, 'admin');
      }
    }

    // Optionally, create a test notification for a seller
    // if (sellerId) {
    //   const seller = await Seller.findById(sellerId).populate('userId');
    //   if (!seller) {
    //     return res.status(404).json({ message: 'Seller not found' });
    //   }
    //   const sellerMessage = `This is a test notification for your out of stock product.`;
    //   await createNotification(seller.userId._id, sellerMessage, 'seller');
    // }

    res.status(200).json({ message: "Test notifications created for admin and seller users" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const cartPaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, totalAmount } = req.body;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel
      .findOne({ _id: decoded.id })
      .populate("cart.product");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    // Validate the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }
    // Perform post-payment actions
      // Reduce product quantity after successful payment
      for (const item of tourist.cart) {
        const product = item.product;
        product.quantity -= item.quantity;
        if (product.quantity < 0) {
          return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
        }
        if (product.quantity === 0) {
          // Create a notification for the admin
          const adminUsers = await Admin.find({});
          const message = `The product ${product.name} is out of stock.`;
      
          for (const admin of adminUsers) {
            await createNotification(admin._id, message, 'admin');
          }
      
          // Create a notification for the seller
          const seller = await Seller.findById(product.seller);
          if (seller) {
            const sellerMessage = `Your product ${product.name} is out of stock.`;
            await createNotification(seller.userId, sellerMessage, 'seller');
          }
        }
      }
    // Save the order to order history
    const order = {
      items: tourist.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      date: new Date(),
    };
    tourist.orderHistory.push(order);

    // Clear the cart after successful payment
    tourist.cart = [];
    await tourist.save();

    res.status(200).json({ message: "Order checked out successfully", order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//view all ordrs
const viewAllOrders = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel
      .findOne({ _id: decoded.id })
      .populate("orderHistory.items.product");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    return res.status(200).json({ orderHistory: tourist.orderHistory });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//view certain order and it's status
const viewOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel
      .findOne({ _id: decoded.id })
      .populate("orderHistory.items.product");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const order = tourist.orderHistory.id(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//105,106 - cancel order by removing it from the order history,adding cancelled order amount back to wallet
const cancelOrder = async (req, res) => {
  try {
    const { orderId, touristId } = req.params;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== touristId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find and remove the order from the order history
    const orderIndex = tourist.orderHistory.findIndex(
      (order) => order._id.toString() === orderId
    );
    const order = tourist.orderHistory.id(orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    tourist.wallet += order.totalAmount;
    tourist.orderHistory.splice(orderIndex, 1); // Remove the order
    await tourist.save();

    return res.status(200).json({ message: "Order canceled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addDeliveryAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const { street, city, state, zipCode, country, floor, apartment } = address;
    if (
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !floor ||
      !apartment
    ) {
      return res
        .status(400)
        .json({ message: "All address fields are required" });
    }
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    tourist.deliveryAddresses.push(address);
    await tourist.save();
    return res.status(200).json({
      message: "Delivery address added successfully",
      deliveryAddresses: tourist.deliveryAddresses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const removeDeliveryAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const addressIndex = tourist.deliveryAddresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    tourist.deliveryAddresses.splice(addressIndex, 1);
    await tourist.save();

    return res.status(200).json({
      message: "Delivery address removed successfully",
      deliveryAddresses: tourist.deliveryAddresses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateDeliveryAddress = async (req, res) => {
  try {
    const { addressId } = req.params; // Assuming the address ID is passed as a URL parameter
    const { updatedAddress } = req.body;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const addressIndex = tourist.deliveryAddresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Update fields of the specific address
    Object.assign(tourist.deliveryAddresses[addressIndex], updatedAddress);
    await tourist.save();

    return res.status(200).json({
      message: "Delivery address updated successfully",
      deliveryAddresses: tourist.deliveryAddresses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const deliveryAddresses = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    return res
      .status(200)
      .json({ deliveryAddresses: tourist.deliveryAddresses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const usePromoCode = async (req, res) => {
  try {
    const { promoCode, touristId } = req.body;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   

    const tourist = await touristModel.findById(touristId).populate('cart.product');
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const promo = await PromoCode.findOne({ code: promoCode });
    if (!promo) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    let totalAmount = 0;
    tourist.cart.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    const discount = promo.discount;
    const newTotalAmount = totalAmount - (totalAmount * (discount / 100));

    res.status(200).json({ discount, newTotalAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const receiveBirthdayPromo = async (req, res) => {
  try {
    const { touristId } = req.params;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    

    const tourist = await touristModel.findById(touristId);
    console.log(tourist); 
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const user = await User.findById(tourist.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const birthDate = new Date(tourist.DOB);

    if (today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()) {
      // Send email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Happy Birthday!',
        text: 'Happy Birthday! Enjoy a special discount on your next purchase.'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        } else {
          return res.status(200).json({ message: 'Birthday email sent successfully' });
        }
      });
    } else {
      return res.status(200).json({ message: 'Today is not the tourist\'s birthday' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
  redeemPoints,
  updatePointsOnPayment,
  addProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
  addProductToCart,
  removeProductFromCart,
  changeCartItemQuantity,
  checkoutOrder,
  cartPaymentSuccess,
  viewAllOrders,
  viewOrder,
  cancelOrder,
  getCart,
  addDeliveryAddress,
  removeDeliveryAddress,
  updateDeliveryAddress,
  deliveryAddresses,
  usePromoCode,
  receiveBirthdayPromo,
  testOutOfStockNotification
};
