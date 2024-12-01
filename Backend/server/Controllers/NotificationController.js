const nodemailer = require('nodemailer');
const Notification = require('../Models/Notification');
const Admin = require('../Models/Admin'); 

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

const createNotification = async (adminId, message) => {
  try {
    // Create the notification in the database
    const notification = new Notification({
      userId: adminId,
      message,
    });
    await notification.save();

    // Fetch the admin's email
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Send the email notification
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: admin.email,
        subject: 'Product out of stock!',
        text: message,
      };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  createNotification,
};