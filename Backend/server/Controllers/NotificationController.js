const nodemailer = require("nodemailer");
const Notification = require("../Models/Notification");
const Admin = require("../Models/Admin");
const Seller = require("../Models/Seller");
const PDFDocument = require("pdfkit");
const Tourist = require('../Models/Tourist');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');
const jwt = require('jsonwebtoken');

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

    if (!tourist.notificationRequests.includes(itineraryId)) {
      tourist.notificationRequests.push(itineraryId);
    }

    if (!tourist.notificationRequests.includes(activityId)) {
      tourist.notificationRequests.push(activityId);
    }

    await tourist.save();

    return res.status(200).json({ message: "Notification request saved successfully" });
  } catch (error) {
    console.error("Error saving notification request:", error);
    return res.status(500).json({
      message: "Error saving notification request",
      error: error.message,
    });
  }
};

const saveNotification = async (touristId, message) => {
  const notification = new Notification({
    touristId,
    message,
  });

  try {
    await notification.save();
    console.log('Notification saved successfully');
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

const sendUpcomingActivityNotifications = async () => {
  try {
    const tourists = await Tourist.find({ notificationRequests: { $exists: true, $not: { $size: 0 } } }).populate('notificationRequests');

    for (const tourist of tourists) {
      for (const activity of tourist.notificationRequests) {
        // Check if the activity is upcoming (e.g., within the next 24 hours)
        const now = new Date();
        const activityDate = new Date(activity.date);
        const timeDifference = activityDate - now;

        if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
          // Send notification on the website
          const message = `Reminder: Your upcoming activity ${activity.name} is scheduled for ${activity.date}.`;
          await saveNotification(tourist._id, message);

          // Send email notification
          await sendMail(tourist.email, tourist.name, 'Upcoming Activity Reminder', message);
        }
      }
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

const sendUpcomingItineraryNotifications = async () => {
  try {
    const tourists = await Tourist.find({ itineraries: { $exists: true, $not: { $size: 0 } } }).populate('itineraries');

    for (const tourist of tourists) {
      for (const itinerary of tourist.itineraries) {
        // Check if the itinerary is upcoming (e.g., within the next 24 hours)
        const now = new Date();
        const itineraryDate = new Date(itinerary.date);
        const timeDifference = itineraryDate - now;

        if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
          // Send notification on the website
          const message = `Reminder: Your upcoming itinerary ${itinerary.name} is scheduled for ${itinerary.date}.`;
          await saveNotification(tourist._id, message);

          // Send email notification
          await sendMail(tourist.email, tourist.name, 'Upcoming Itinerary Reminder', message);
        }
      }
    }
  } catch (error) {
    console.error("Error sending itinerary notifications:", error);
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

    const notifications = await Notification.find({ touristId: decoded.id }).populate('touristId');
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};
module.exports = {
  createNotification,
  sendReceipt,
  sendMail,
  createSystemNotification, 
  sendUpcomingActivityNotifications,
  sendUpcomingItineraryNotifications,
  requestNotification,
  getNotifications
};
