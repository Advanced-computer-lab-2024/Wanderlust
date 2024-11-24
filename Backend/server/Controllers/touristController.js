const touristModel = require("../Models/Tourist");
const locationsModel = require("../Models/Locations");
const activityModel = require("../Models/Activity");
const itineraryModel = require("../Models/Itinerary");
const { default: mongoose } = require("mongoose");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const ProductModel = require("../Models/Products");

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
  const { nationality, DOB, jobOrStudent,currency } = req.body;
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
    const { email, password, mobileNumber, currency, ...touristData } = req.body;

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
     const updatedTourist = await touristModel.findOneAndUpdate(
      { userId: user._id },
      touristUpdates,
      {
        new: true,
        session,
      }
    ).populate("userId");

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
    let currency = 'EGP'; // Default currency
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

    res.status(200).json({ locations, activities: convertedActivities, itineraries });
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
  const tourist = await touristModel.findById(touristId);

  if (!tourist) throw new Error("Tourist not found");

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
  return { points: tourist.points, badge: tourist.badge, level };
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
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (tourist.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    tourist.wishlist.push(productId);
    await tourist.save();
    return res.status(200).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const getWishlist = async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id }).populate('wishlist');
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    return res.status(200).json({ wishlist: tourist.wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const productIndex = tourist.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(400).json({ message: 'Product not in wishlist' });
    }

    tourist.wishlist.splice(productIndex, 1);
    await tourist.save();
    return res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      tourist.cart[cartItemIndex].quantity += quantity;
    } else {
      tourist.cart.push({ product: productId, quantity });
    }

    await tourist.save();


    return res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//remove product from cart
const removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      tourist.cart.splice(cartItemIndex, 1);
      await tourist.save();
      return res.status(200).json({ message: 'Product removed from cart successfully' });
    } else {
      return res.status(400).json({ message: 'Product not in cart' });
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
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      tourist.cart[cartItemIndex].quantity = quantity;
      await tourist.save();
      return res.status(200).json({ message: 'Cart item quantity updated successfully' });
    } else {
      return res.status(400).json({ message: 'Product not in cart' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//checkout my order 
/*
  need to implement a payment processing function @ali Mousa 
  for amgad edit this when Ali is done with payment processing function 
*/
const checkoutOrder = async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id }).populate('cart.product');
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    if (tourist.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    tourist.cart.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    // Assuming you have a payment processing function
    // const paymentResult = await processPayment(totalAmount);
    // if (!paymentResult.success) {
    //   return res.status(400).json({ message: 'Payment failed' });
    // }

    // Save the order to order history
    const order = {
      items: tourist.cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount,
      date: new Date()
    };
    tourist.orderHistory.push(order);

    // Clear the cart after successful payment
    tourist.cart = [];
    await tourist.save();

    res.status(200).json({ message: 'Order checked out successfully', order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//view all ordrs
const viewAllOrders = async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id }).populate('orderHistory.items.product');
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
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
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id }).populate('orderHistory.items.product');
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const order = tourist.orderHistory.id(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//105,106 - cancel order by removing it from the order history,adding cancelled order amount back to wallet
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Find and remove the order from the order history
    const orderIndex = tourist.orderHistory.findIndex(order => order._id.toString() === orderId);
    const order = tourist.orderHistory.id(orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    tourist.wallet += order.totalAmount;
    tourist.orderHistory.splice(orderIndex, 1); // Remove the order
    await tourist.save();

    return res.status(200).json({ message: 'Order canceled successfully' });
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
  viewAllOrders,
  viewOrder,
  cancelOrder
};
