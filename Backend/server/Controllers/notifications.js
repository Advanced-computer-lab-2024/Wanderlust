const nodemailer = require('nodemailer');
const Tourist = require('../Models/Tourist'); 
const Activity = require('../Models/Activity'); 

const sendNotifications = async () => {
  try {
    const tourists = await Tourist.find({ notificationRequests: { $exists: true, $not: { $size: 0 } } }).populate('notificationRequests');

    for (const tourist of tourists) {
      for (const activity of tourist.notificationRequests) {
        // Check if the activity is upcoming (e.g., within the next 24 hours)
        const now = new Date();
        const activityDate = new Date(activity.date);
        const timeDifference = activityDate - now;

        if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
          // Send notification on the website (e.g., save to a notifications collection)
          // ...

          // Send email notification
          await sendEmailNotification(tourist.email, activity);
        }
      }
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

const sendEmailNotification = async (email, activity) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Upcoming Event Reminder',
    text: `Dear Tourist, this is a reminder for your upcoming event: ${activity.name} on ${activity.date}.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendNotifications
};