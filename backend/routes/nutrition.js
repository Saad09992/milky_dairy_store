const router = require("express").Router();
const {
  getProductNutrition,
  createProductNutrition,
  updateProductNutrition,
  deleteProductNutrition,
} = require("../controllers/nutrition.controller");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");

// Get nutrition data for a specific product
router.get("/:productId", getProductNutrition);

// Create nutrition data for a product (admin only)
router.post("/:productId", verifyToken, verifyAdmin, createProductNutrition);

// Update nutrition data for a product (admin only)
router.put("/:productId", verifyToken, verifyAdmin, updateProductNutrition);

// Delete nutrition data for a product (admin only)
router.delete("/:productId", verifyToken, verifyAdmin, deleteProductNutrition);

module.exports = router; 