const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../Controllers/ActivityCatController");

router.post("/createCategory", createCategory);
router.get("/getCategories", getCategories);
router.put("/updateCategory", updateCategory);
router.delete("/deleteCategory", deleteCategory);

module.exports = router;
