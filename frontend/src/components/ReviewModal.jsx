import {
  Backdrop,
  Button,
  HelperText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
  Input,
} from "@windmill/react-ui";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
import reviewService from "../services/review.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { createReview, updateReview } from "../store/methods/reviewMethod";

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

const ReviewModal = ({ isOpen, onClose, productId, review = null }) => {
  const { userData } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      rating: review?.rating || 0,
      content: review?.content || "",
    },
    validationSchema: reviewSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (review) {
          await dispatch(
            updateReview({
              reviewId: review.id,
              reviewData: values,
            })
          ).unwrap();
          toast.success("Review updated successfully!");
        } else {
          await dispatch(
            createReview({
              productId,
              reviewData: values,
            })
          ).unwrap();
          toast.success("Review submitted successfully!");
        }
        onClose();
        navigate(0);
      } catch (error) {
        toast.error(error.message || "Failed to submit review");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 z-40 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {review ? "Edit Review" : "Write a Review"}
                </h3>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div>
                    <Label className="block mb-2">
                      <span className="text-gray-900 font-medium">Rating</span>
                    </Label>
                    <ReactStars
                      count={5}
                      value={formik.values.rating}
                      onChange={(newRating) => {
                        formik.setFieldValue("rating", newRating);
                      }}
                      size={30}
                      color2="#F59E0B"
                      half={false}
                    />
                    {formik.touched.rating && formik.errors.rating && (
                      <HelperText valid={false} className="text-red-600 mt-1">
                        {formik.errors.rating}
                      </HelperText>
                    )}
                  </div>

                  <Label className="block">
                    <span className="text-gray-900 font-medium">Review</span>
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
                  </Label>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="w-full sm:w-auto sm:ml-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formik.isSubmitting
                        ? "Submitting..."
                        : review
                        ? "Update Review"
                        : "Submit Review"}
                    </Button>
                    <Button
                      type="button"
                      onClick={onClose}
                      className="mt-3 sm:mt-0 w-full sm:w-auto bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
