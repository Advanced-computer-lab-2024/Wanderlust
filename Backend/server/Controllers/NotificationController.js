const nodemailer = require('nodemailer');
const Notification = require('../Models/Notification');
const Admin = require('../Models/Admin'); 
const Seller = require('../Models/Seller');
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const createNotification = async (userId, message, userType = 'admin') => {
    try {
      // Create the notification in the database
      const notification = new Notification({
        userId,
        message,
      });
      await notification.save();
  
      // Fetch the user's email based on userType
      let userEmail;
      if (userType === 'admin') {
        const admin = await Admin.findById(userId);
        if (!admin) {
          throw new Error('Admin not found');
        }
        userEmail = admin.email;
      } else if (userType === 'seller') {
        const seller = await Seller.findById(userId).populate('userId');
        if (!seller) {
          throw new Error('Seller not found');
        }
        userEmail = seller.userId.email; // Assuming the Seller model has a reference to the User model which contains the email
      }
  
      // Send the email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
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