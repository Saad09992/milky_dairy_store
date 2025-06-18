import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
  userReview: null,
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    // Get reviews
    getReviewsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getReviewsSuccess: (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews || [];
      state.userReview = action.payload.userReview || null;
    },
    getReviewsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add review
    addReviewStart: (state) => {
      state.submitting = true;
      state.submitError = null;
    },
    addReviewSuccess: (state, action) => {
      state.submitting = false;
      state.userReview = action.payload;
      // Add the new review to the reviews array
      state.reviews = [action.payload, ...state.reviews];
    },
    addReviewFailure: (state, action) => {
      state.submitting = false;
      state.submitError = action.payload;
    },

    // Update review
    updateReviewStart: (state) => {
      state.submitting = true;
      state.submitError = null;
    },
    updateReviewSuccess: (state, action) => {
      state.submitting = false;
      state.userReview = action.payload;
      // Update the review in the reviews array
      state.reviews = state.reviews.map((review) =>
        review.id === action.payload.id ? action.payload : review
      );
    },
    updateReviewFailure: (state, action) => {
      state.submitting = false;
      state.submitError = action.payload;
    },

    // Clear reviews
    clearReviews: (state) => {
      state.reviews = [];
      state.userReview = null;
      state.loading = false;
      state.error = null;
      state.submitting = false;
      state.submitError = null;
    },

    // Clear errors
    clearReviewErrors: (state) => {
      state.error = null;
      state.submitError = null;
    },
  },
});

export const {
  getReviewsStart,
  getReviewsSuccess,
  getReviewsFailure,
  addReviewStart,
  addReviewSuccess,
  addReviewFailure,
  updateReviewStart,
  updateReviewSuccess,
  updateReviewFailure,
  clearReviews,
  clearReviewErrors,
} = reviewSlice.actions;

export default reviewSlice.reducer; 