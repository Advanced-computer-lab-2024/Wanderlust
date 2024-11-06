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
          { folder: "Documents", resource_type: "auto" },
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

    const updatedUser = await Model.findOneAndUpdate({ userId }, updateField, {
      new: true,
    });
    if (!updatedUser) return res.status(404).send("User not found");
    res
      .status(200)
      .json({ message: "Document uploaded successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const uploadImage = async (req, res) => {
  try {
    const { userType, documentType } = req.params;
    const { userId } = req.body;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "Images", resource_type: "image" },
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
    if (documentType === "photo" && userType === "TourGuide")
      updateField.photoURL = result.secure_url;
    else if (documentType === "logo" && userType === "Advertiser")
      updateField.logoURL = result.secure_url;
    else if (documentType === "logo" && userType === "Seller")
      updateField.logoURL = result.secure_url;
    else return res.status(400).send("Invalid document type");

    const updatedUser = await Model.findOneAndUpdate({ userId }, updateField, {
      new: true,
    });
    if (!updatedUser) return res.status(404).send("User not found");
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

    const user = await Model.find({ userId });
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

    const user = await Model.findOne({ userId });
    if (!user) return res.status(404).send("User not found");
    let publicId;
    let resourceType = "raw"; // Default to 'raw' for general files

    if (documentType === "id") {
      publicId = user.IdURL;
    } else if (documentType === "certificate" && userType === "TourGuide") {
      publicId = user.certificatesURL;
    } else if (documentType === "taxation") {
      publicId = user.taxationRegistryCardURL;
    } else if (documentType === "logo" && userType === "Advertiser") {
      updateField.logoURL = result.secure_url;
    } else if (documentType === "logo" && userType === "Seller")
      updateField.logoURL = result.secure_url;
    else if (documentType === "photo" && userType === "TourGuide") {
      updateField.photoURL = result.secure_url;
    } else {
      return res.status(400).send("Invalid document type");
    }

    // Determine resource type based on document type, if known
    if (documentType === "id" && publicId.endsWith(".jpg")) {
      resourceType = "image";
    } else if (documentType === "certificate" && publicId.endsWith(".pdf")) {
      resourceType = "raw";
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    const updateField = {};
    if (documentType === "id") updateField.IdURL = "";
    else if (documentType === "certificate" && userType === "TourGuide")
      updateField.certificatesURL = "";
    else if (documentType === "taxation")
      updateField.taxationRegistryCardURL = "";
    else if (documentType === "logo") updateField.logoURL = "";
    else if (documentType === "photo" && userType === "TourGuide")
      updateField.photoURL = "";

    const updatedUser = await Model.findOneAndUpdate({ userId }, updateField, {
      new: true,
    });
    if (!updatedUser) return res.status(404).send("User not found");

    res
      .status(200)
      .json({ message: "Document deleted successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadDocument, uploadImage, getDocuments, deleteDocument };
