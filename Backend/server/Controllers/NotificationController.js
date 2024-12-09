const nodemailer = require("nodemailer");
const Notification = require("../Models/Notification");
const Admin = require("../Models/Admin");
const Seller = require("../Models/Seller");
const PDFDocument = require("pdfkit");
const Tourist = require('../Models/Tourist');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');
const jwt = require('jsonwebtoken');
const Tourguide = require('../Models/tourGuide');
const Advertiser = require('../Models/Advertiser');

const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createNotification = async (userId, message, userType = "admin") => {
  try {
    // Create the notification in the database
    const notification = new Notification({
      userId,
      message,
    });
    await notification.save();

    // Fetch the user's email based on userType
    let userEmail;
    if (userType === "admin") {
      const admin = await Admin.findById(userId);
      if (!admin) {
        throw new Error("Admin not found");
      }
      userEmail = admin.email;
    } else if (userType === "seller") {
      const seller = await Seller.findById(userId).populate("userId");
      if (!seller) {
        throw new Error("Seller not found");
      }
      userEmail = seller.userId.email; // Assuming the Seller model has a reference to the User model which contains the email
    }

    // Send the email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Product out of stock!",
      text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new Error(error);
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const createSystemNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      userId,
      message,
    });
    await notification.save();
    console.log("Notification created successfully.");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const sendReceipt = async (email, name, eventName, amount) => {
  try {
    // Step 1: Create a temporary file in a custom directory
    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }
    const tmpFilePath = path.join(tmpDir, `receipt-${Date.now()}.pdf`);

    // Step 2: Generate PDF receipt
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(tmpFilePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Event: ${eventName}`);
    doc.text(`Amount Paid: $${amount}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("PDF generated successfully at:", tmpFilePath);

    // Step 3: Send email with PDF attached
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Payment Receipt",
      text: `Dear ${name},\n\nThank you for your payment for the event "${eventName}". Attached is your receipt.\n\nBest regards,`,
      attachments: [
        {
          filename: "PaymentReceipt.pdf",
          path: tmpFilePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");

    // Step 4: Clean up the temporary file
    fs.unlinkSync(tmpFilePath);
  } catch (error) {
    console.error("Error sending receipt:", error);
    return { error: "Failed to send receipt." };
  }
};

const sendMail = async (email, name, title, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,
      text: `Dear ${name},\n\n${message}\n\nBest regards,`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send email." };
  }
};
const createTouristNotification = async (userId, message, userType = "tourist") => {
  try {
    // Create the notification in the database
    const notification = new Notification({
      userId,
      message,
    });
    await notification.save();

    // Fetch the user's email based on userType
    let userEmail;
    if (userType === "tourist") {
      const tourist = await Tourist.findById(userId);
      if (!tourist) {
        throw new Error("Tourist not found");
      }
      userEmail = tourist.email;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Upcoming Event Notification",
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const requestNotification = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await Tourist.findById(decoded.id);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const { itineraryId, activityId } = req.body;

    let eventName;
    if (itineraryId) {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      eventName = itinerary.name;
    } else if (activityId) {
      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      eventName = activity.name;
    } else {
      return res.status(400).json({ message: "No itinerary or activity ID provided" });
    }

    const message = `Upcoming Event: ${eventName}`;
    await createTouristNotification(tourist._id, message, "tourist");

    res.status(200).json({ message: "Notification request processed successfully" });
  } catch (error) {
    console.error("Error processing notification request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Validate Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Invalid Authorization header format" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);

    // Fetch notifications for the user
    const notifications = await Notification.find({ userId: decoded.id }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getNotificationsAll = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Validate Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Invalid Authorization header format" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);

    // Check if the user is a tourist, tourguide, or advertiser
    const tourist = await Tourist.findOne({ _id: decoded.id });
    const tourguide = await Tourguide.findOne({ _id: decoded.id });
    const advertiser = await Advertiser.findOne({ _id: decoded.id });
    const userId = tourist ? tourist.userId : tourguide ? tourguide.userId : advertiser ? advertiser.userId : decoded.id;
    console.log("User ID:", userId);

    // Fetch notifications for the user
    const notifications = await Notification.find({ userId: decoded.id }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = {
  createNotification,
  sendReceipt,
  sendMail,
  createSystemNotification, 
  requestNotification,
  getNotifications
};
