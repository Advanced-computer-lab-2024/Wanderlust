const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require("../Controllers/documentsController");
const router = express.Router();

router.post(
  "/uploadDocument/:userType/:documentType",
  upload.single("file"),
  uploadDocument
);
router.get("/getDocuments/:userType/:userId", getDocuments);
router.delete(
  "/deleteDocument/:userType/:documentType/:userId",
  deleteDocument
);

module.exports = router;
