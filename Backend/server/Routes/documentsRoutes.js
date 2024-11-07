const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  uploadDocument,
  uploadImage,
  uploadProductImage,
  getDocuments,
} = require("../Controllers/documentsController");
const router = express.Router();

router.put(
  "/uploadDocument/:userType/:documentType",
  upload.single("file"),
  uploadDocument
);
router.put(
  "/uploadImage/:userType/:documentType",
  upload.single("file"),
  uploadImage
);
router.put(
  "/uploadProductImage/:productId",
  upload.single("file"),
  uploadProductImage
);
router.get("/getDocuments/:userType/:userId", getDocuments);
// router.delete(
//   "/deleteDocument/:userType/:documentType/:userId",
//   deleteDocument
// );

module.exports = router;
