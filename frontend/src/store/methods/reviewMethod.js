import { createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "../../services/review.service";
import {
  getReviewsStart,
  getReviewsSuccess,
  getReviewsFailure,
  addReviewStart,
  addReviewSuccess,
  addReviewFailure,
  updateReviewStart,
  updateReviewSuccess,
  updateReviewFailure,
} from "../slices/reviewSlice";

// Get reviews for a product
export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId, { dispatch }) => {
    try {
      dispatch(getReviewsStart());
      const response = await reviewService.getReviews(productId);
      
      // Separate user review from other reviews
      const reviews = response.data.reviews || [];
      const userReview = response.data.userReview || null;
      
      dispatch(getReviewsSuccess({ reviews, userReview }));
      return { reviews, userReview };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch reviews";
      dispatch(getReviewsFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

// Add a new review
export const createReview = createAsyncThunk(
  "review/createReview",
  async ({ productId, reviewData }, { dispatch }) => {
    try {
      dispatch(addReviewStart());
      const response = await reviewService.addReview(productId, reviewData);
      
      dispatch(addReviewSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create review";
      dispatch(addReviewFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

// Update an existing review
export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ reviewId, reviewData }, { dispatch }) => {
    try {
      dispatch(updateReviewStart());
      const response = await reviewService.updateReview(reviewId, reviewData);
      
      dispatch(updateReviewSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update review";
      dispatch(updateReviewFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
); 