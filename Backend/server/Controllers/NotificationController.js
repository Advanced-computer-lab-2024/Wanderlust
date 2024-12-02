const nodemailer = require("nodemailer");
const Notification = require("../Models/Notification");
const Admin = require("../Models/Admin");
const Seller = require("../Models/Seller");
const PDFDocument = require("pdfkit");
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
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
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

module.exports = {
  createNotification,
  sendReceipt,
};
