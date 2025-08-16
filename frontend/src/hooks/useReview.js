import { useSelector, useDispatch } from "react-redux";
import { getReviews, createReview, updateReview } from "../store/methods/reviewMethod";
import { clearReviews, clearReviewErrors } from "../store/slices/reviewSlice";
import { useCallback } from "react";

const useReview = () => {
  const dispatch = useDispatch();
  const {
    reviews,
    userReview,
    loading,
    error,
    submitting,
    submitError,
  } = useSelector((state) => state.reviewReducer);

  const fetchReviews = useCallback((productId) => {
    return dispatch(getReviews(productId));
  }, [dispatch]);

  const addReview = useCallback((productId, reviewData) => {
    return dispatch(createReview({ productId, reviewData }));
  }, [dispatch]);

  const editReview = useCallback((reviewId, reviewData) => {
    return dispatch(updateReview({ reviewId, reviewData }));
  }, [dispatch]);

  const clearReviewState = useCallback(() => {
    dispatch(clearReviews());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearReviewErrors());
  }, [dispatch]);

  return {
    reviews,
    userReview,
    loading,
    error,
    submitting,
    submitError,
    fetchReviews,
    addReview,
    editReview,
    clearReviewState,
    clearErrors,
  };
};

export default useReview; 