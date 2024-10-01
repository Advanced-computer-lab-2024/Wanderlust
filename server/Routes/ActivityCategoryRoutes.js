const express = require('express');
const router = express.Router();
const activityCategoryController = require('../Controllers/ActivityCategoryController');

router.use(express.json())
router.post("/createCat",activityCategoryController.createCategory);
router.get("/allCat",activityCategoryController.getAllCategories);
router.put("/UpdateCat",activityCategoryController.updateCategory);
router.delete("/DeleteCat",activityCategoryController.deleteCategory);

module.exports = router;