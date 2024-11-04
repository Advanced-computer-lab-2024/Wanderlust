const cloudinary = require("cloudinary").v2;
const TourGuide = require("../Models/tourGuide");
const Advertiser = require("../Models/Advertiser");
const Seller = require("../Models/Seller");

// documentController.js

// Upload a document for a specific user type
const uploadDocument = async (req, res) => {
  try {
    const { userType, documentType } = req.params;
    const { userId } = req.body;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "Documents", resource_type: "raw" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Determine model and update field
    let Model;
    if (userType === "TourGuide") Model = TourGuide;
    else if (userType === "Advertiser") Model = Advertiser;
    else if (userType === "Seller") Model = Seller;
    else return res.status(400).send("Invalid user type");

    const updateField = {};
    if (documentType === "id") updateField.IdURL = result.secure_url;
    else if (documentType === "certificate" && userType === "TourGuide")
      updateField.certificatesURL = result.secure_url;
    else if (documentType === "taxation")
      updateField.taxationRegistryCardURL = result.secure_url;
    else return res.status(400).send("Invalid document type");

    const updatedUser = await Model.findByIdAndUpdate(userId, updateField, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Document uploaded successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve documents for a user
const getDocuments = async (req, res) => {
  try {
    const { userType, userId } = req.params;
    let Model;

    if (userType === "TourGuide") Model = TourGuide;
    else if (userType === "Advertiser") Model = Advertiser;
    else if (userType === "Seller") Model = Seller;
    else return res.status(400).send("Invalid user type");

    const user = await Model.findById(userId);
    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a document for a user
const deleteDocument = async (req, res) => {
  try {
    const { userType, documentType, userId } = req.params;
    let Model;

    if (userType === "TourGuide") Model = TourGuide;
    else if (userType === "Advertiser") Model = Advertiser;
    else if (userType === "Seller") Model = Seller;
    else return res.status(400).send("Invalid user type");

    const user = await Model.findById(userId);
    if (!user) return res.status(404).send("User not found");

    let publicId;
    if (documentType === "id") publicId = user.IdURL;
    else if (documentType === "certificate" && userType === "TourGuide")
      publicId = user.certificatesURL;
    else if (documentType === "taxation")
      publicId = user.taxationRegistryCardURL;
    else return res.status(400).send("Invalid document type");

    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    const updateField = {};
    if (documentType === "id") updateField.IdURL = "";
    else if (documentType === "certificate" && userType === "TourGuide")
      updateField.certificatesURL = "";
    else if (documentType === "taxation")
      updateField.taxationRegistryCardURL = "";

    const updatedUser = await Model.findByIdAndUpdate(userId, updateField, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Document deleted successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadDocument, getDocuments, deleteDocument };
