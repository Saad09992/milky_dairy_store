const {
  createReviewDb,
  getReviewsDb,
  updateReviewDb,
} = require("../db/review.db");
const { ErrorHandler } = require("../helpers/error");

class ProductService {
  addReview = async (data) => {
    try {
      return await createReviewDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getReviews = async (data) => {
    try {
      console.log(data);
      return await getReviewsDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  updateReview = async (data) => {
    try {
      return await updateReviewDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}

module.exports = new ProductService();
