const reviewService = require("../services/review.service");

const getProductReviews = async (req, res) => {
  const reviews = await reviewService.getReviews(req.params);
  res.json(reviews);
};

const createProductReview = async (req, res) => {
  const { content, rating } = req.body;
  const { product_id } = req.params;
  const userId = req.user.id;
  const reviews = await reviewService.addReview({
    product_id,
    userId,
    content,
    rating,
  });
  res.json(reviews);
};

const updateProductReview = async (req, res) => {
  const { content, rating } = req.body;
  const { id } = req.params;
  console.log(content, rating, id);
  const reviews = await reviewService.updateReview({
    content,
    rating,
    id,
  });
  res.json(reviews);
};

module.exports = {
  getProductReviews,
  createProductReview,
  updateProductReview,
};
