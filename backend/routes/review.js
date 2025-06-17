const router = require("express").Router();
const {
  getProductReviews,
  createProductReview,
  updateProductReview,
} = require("../controllers/review.controller");
const verifyToken = require("../middleware/verifyToken");

router.route("/:id").put(verifyToken, updateProductReview);

router
  .route("/:product_id")
  .get(getProductReviews)
  .post(verifyToken, createProductReview);

module.exports = router;
