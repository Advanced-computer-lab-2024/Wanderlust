const Booking = require("../Models/Booking");
const touristModel = require("../Models/Tourist");
const locationsModel = require("../Models/Locations");
const activityModel = require("../Models/Activity");
const itineraryModel = require("../Models/Itinerary");
const productModel = require("../Models/Products");
const Notification = require("../Models/Notification");
const Seller = require("../Models/Seller");
const PromoCode = require("../Models/PromoCode");
const {
  createNotification,
  sendMail,
  createSystemNotification,
} = require("./NotificationController");

const Admin = require("../Models/Admin");

const { default: mongoose } = require("mongoose");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const ProductModel = require("../Models/Products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe Secret Key
const nodemailer = require("nodemailer");

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
      return { error: "Tourist not found" };
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
    return { points: tourist.points, badge: tourist.badge, level };
  } catch (error) {
    return { error: error.message };
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
      return res.status(400).json({
        message: `Only ${product.quantity} units of ${product.name} are available`,
      });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      const newQuantity = tourist.cart[cartItemIndex].quantity + quantityToAdd;
      if (newQuantity > product.quantity) {
        return res.status(400).json({
          message: `Only ${product.quantity} units of ${product.name} are available`,
        });
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
      return res.status(400).json({
        message: `Only ${product.quantity} units of ${product.name} are available`,
      });
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
    if (!tourist) {
      return { success: false, message: "Tourist not found" };
    }

    switch (paymentMethod) {
      case "wallet":
        if (tourist.wallet < totalAmount) {
          return { success: false, message: "Insufficient wallet balance" };
        }
        tourist.wallet -= totalAmount;
        await tourist.save();
        const walletPostPayment = await postPaymentSuccess(
          tourist._id,
          totalAmount
        );
        if (!walletPostPayment.success) {
          return {
            success: false,
            message: walletPostPayment.message,
          };
        }
        return { success: true, message: "Payment successful using wallet" };

      case "cod":
        const codPostPayment = await postPaymentSuccess(
          tourist._id,
          totalAmount
        );
        if (!codPostPayment.success) {
          return {
            success: false,
            message: codPostPayment.message,
          };
        }
        return { success: true, message: "Payment successful using COD" };

      case "card":
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Convert to cents
            currency: tourist.currency,
            automatic_payment_methods: { enabled: true },
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

      default:
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
    const { paymentMethod, totalAmount } = req.body;

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

    if (!tourist.cart || tourist.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const paymentResult = await processPayment(
      totalAmount,
      tourist._id,
      paymentMethod
    );

    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.message });
    }

    if (paymentMethod === "card" && paymentResult.clientSecret) {
      return res.status(200).json({
        clientSecret: paymentResult.clientSecret,
        message: "Proceed with card payment",
      });
    }

    return res.status(200).json({ message: paymentResult.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postPaymentSuccess = async (touristId, totalAmount) => {
  try {
    const tourist = await touristModel
      .findOne({ _id: touristId })
      .populate("cart.product");

    if (!tourist || !tourist.cart || tourist.cart.length === 0) {
      return { success: false, message: "Cart is empty or tourist not found" };
    }

    await updatePointsOnPayment(touristId, totalAmount);
    updateBadge(tourist);

    for (const item of tourist.cart) {
      const product = await productModel.findById(item.product);

      if (!product) {
        return {
          success: false,
          message: `Product with ID ${item.product} not found`,
        };
      }

      product.quantity -= item.quantity;

      if (product.quantity < 0) {
        return {
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
        };
      }

      await product.save();

      if (product.quantity === 0) {
        const adminUsers = await Admin.find({});
        const message = `The product ${product.name} is out of stock.`;
        for (const admin of adminUsers) {
          await createNotification(admin._id, message, "admin");
        }

        const seller = await Seller.findById(product.seller);
        if (seller) {
          const sellerMessage = `Your product ${product.name} is out of stock.`;
          await createNotification(seller.userId, sellerMessage, "seller");
        }
      }
    }

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
    tourist.cart = [];
    await tourist.save();

    return { success: true, message: "Order checked out successfully", order };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const cardPaymentSuccess = async (req, res) => {
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
    await postPaymentSuccess(tourist._id, totalAmount);
    return res
      .status(200)
      .json({ message: "Order checked out successfully", order });
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
        return res.status(404).json({ message: "Admin not found" });
      }
      const message = `This is a test notification for out of stock products.`;
      await createNotification(adminId, message, "admin");
    } else {
      // Create a notification for all admins if no specific adminId is provided
      const adminUsers = await Admin.find({});
      const message = `This is a test notification for out of stock products.`;

      for (const admin of adminUsers) {
        await createNotification(admin._id, message, "admin");
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

    res.status(200).json({
      message: "Test notifications created for admin and seller users",
    });
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
    const { promoCodeId, orderAmount } = req.body;
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

    const promo = await PromoCode.findById(promoCodeId);
    if (!promo) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    const discount = promo.discount;
    const newTotalAmount = orderAmount - orderAmount * (discount / 100);

    res.status(200).json({ discount, newTotalAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const receiveBirthdayPromo = async (req, res) => {
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

    const user = await User.findById(tourist.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const birthDate = new Date(tourist.DOB);

    if (
      today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth()
    ) {
      // Send email
      const title = `Happy Birthday ${user.username}!`;
      const message =
        "Happy Birthday! Enjoy a special discount on your next purchase. To celebrate your birthday, we are offering you a 20% discount on all products. Use the promo code Birthday20 at checkout to redeem your discount. This promo code is valid for 24 hours only.";
      await sendMail(user.email, user.username, title, message);

      // Create notification
      await createSystemNotification(user._id, message);

      return res
        .status(200)
        .json({ message: "Birthday email and notification sent successfully" });
    } else {
      return res
        .status(200)
        .json({ message: "Today is not the tourist's birthday" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPromoCodeId = async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code });
    if (!promo) {
      return res.status(404).json({ message: "Promo code not found" });
    }
    res.status(200).json({ promoCodeId: promo._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const sendUpcomingEventReminder = async (req, res) => {
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

    const user = await User.findById(tourist.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Fetch events linked to the tourist that are occurring soon (e.g., within 7 days)
    const today = new Date();
    const upcomingDate = new Date();
    upcomingDate.setDate(today.getDate() + 7); // 7 days from today

    const upcomingEvents = await Notification.find({
      userId: tourist._id,
      eventDate: { $gte: today, $lte: upcomingDate }, // Ensure eventDate exists in the Notification model
    });

    if (upcomingEvents.length === 0) {
      return res.status(200).json({ message: "No upcoming events to remind" });
    }
    // Prepare and send email without event details
    const title = `Reminder: Upcoming Events`;
    const message = `Hello ${user.username},\n\nYou have upcoming events scheduled within the next 7 days. Please check your account for more details.\n\nBest regards, Your Travel App Team`;

    await sendMail(user.email, user.username, title, message);

    return res.status(200).json({ message: "Upcoming event reminder email sent successfully" });
  } catch (error) {
    console.error("Error sending event reminders:", error);
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
  updateBadge,
  addProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
  addProductToCart,
  removeProductFromCart,
  changeCartItemQuantity,
  checkoutOrder,
  cardPaymentSuccess,
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
  testOutOfStockNotification,
  getPromoCodeId,
  sendUpcomingEventReminder
};
