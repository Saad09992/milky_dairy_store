import { Button } from "@windmill/react-ui";
import { useState, useEffect } from "react";
import { Star, MessageSquare, Edit, X } from "react-feather";
import ReviewCard from "./ReviewCard";
import useReview from "../hooks/useReview";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactStars from "react-rating-stars-component";
import { Input, Label, HelperText } from "@windmill/react-ui";

const reviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating is required")
    .max(5, "Rating must be between 1 and 5")
    .required("Rating is required"),
  content: Yup.string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must not exceed 500 characters")
    .required("Review is required"),
});

const ReviewsSection = ({ productId }) => {
  const [showForm, setShowForm] = useState(false);
  const { loggedIn } = useAuth();
  const {
    reviews,
    userReview,
    loading,
    error,
    submitting,
    fetchReviews,
    addReview,
    editReview,
    clearReviewState,
  } = useReview();

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }

    return () => {
      clearReviewState();
    };
  }, [productId, fetchReviews, clearReviewState]);

  const formik = useFormik({
    initialValues: {
      rating: userReview?.rating || 0,
      content: userReview?.content || "",
    },
    validationSchema: reviewSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (userReview) {
          await editReview(userReview.id, values);
          toast.success("Review updated successfully!");
        } else {
          await addReview(productId, values);
          toast.success("Review submitted successfully!");
          resetForm();
        }
        setShowForm(false);
      } catch (error) {
        toast.error(error.message || "Failed to submit review");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleAddReview = () => {
    if (!loggedIn) {
      toast.error("Please login to add a review");
      return;
    }
    setShowForm(true);
  };

  const handleEditReview = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    formik.resetForm();
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Reviews Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold text-gray-900">
                      {averageRating}
                    </span>
                  </div>
                  <span className="text-gray-500">({reviews?.length || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Add/Edit Review Button */}
            <div className="flex gap-3">
              {userReview ? (
                <Button
                  onClick={handleEditReview}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="w-4 h-4" />
                  Edit Review
                </Button>
              ) : (
                <Button
                  onClick={handleAddReview}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="w-4 h-4" />
                  Write a Review
                </Button>
              )}
            </div>
          </div>

          {/* Inline Review Form */}
          {showForm && (
            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {userReview ? "Edit Your Review" : "Write Your Review"}
                </h3>
                <Button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                  <Label className="block mb-2">
                    <span className="text-gray-900 font-medium">Rating</span>
                  </Label>
                  <select
                    name="rating"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a rating</option>
                    <option value="1">1 Star - Poor</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="5">5 Stars - Excellent</option>
                  </select>
                  {formik.touched.rating && formik.errors.rating && (
                    <HelperText valid={false} className="text-red-600 mt-1">
                      {formik.errors.rating}
                    </HelperText>
                  )}
                </div>

                <div>
                  <Label className="block mb-2">
                    <span className="text-gray-900 font-medium">Review</span>
                  </Label>
                  <Input
                    as="textarea"
                    name="content"
                    rows={4}
                    placeholder="Share your experience with this product..."
                    valid={formik.touched.content && !formik.errors.content}
                    error={formik.touched.content && formik.errors.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                  />
                  {formik.touched.content && formik.errors.content && (
                    <HelperText valid={false} className="text-red-600 mt-1">
                      {formik.errors.content}
                    </HelperText>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {formik.isSubmitting
                      ? "Submitting..."
                      : userReview
                      ? "Update Review"
                      : "Submit Review"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* User Review Section */}
          {userReview && !showForm && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Review
              </h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ReviewCard reviews={[userReview]} />
              </div>
            </div>
          )}

          {/* All Reviews Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {userReview ? "Other Reviews" : "All Reviews"}
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading reviews...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading reviews: {error}</p>
                <Button
                  onClick={() => fetchReviews(productId)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <ReviewCard 
                reviews={userReview 
                  ? reviews.filter(review => review.id !== userReview.id)
                  : reviews
                } 
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection; 