import api from "../api/baseUrl";

class ReviewService {
  // Get reviews for a specific product
  getReviews(productId) {
    return api.get(`/review/${productId}`);
  }

  // Add a new review for a product
  addReview(productId, reviewData) {
    return api.post(`/review/${productId}`, {
      content: reviewData.content,
      rating: reviewData.rating,
    });
  }

  // Update an existing review
  updateReview(reviewId, reviewData) {
    return api.put(`/review/${reviewId}`, {
      content: reviewData.content,
      rating: reviewData.rating,
    });
  }

  // Delete a review (if needed)
  deleteReview(reviewId) {
    return api.delete(`/review/${reviewId}`);
  }
}

export default new ReviewService();
