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
import { useUser } from "context/UserContext";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
import reviewService from "services/review.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { createReview } from "../store/methods/reviewMethod";

const reviewSchema = Yup.object().shape({
  rating: Yup.number().required("Rating is required").min(1).max(5),
  comment: Yup.string().required("Comment is required"),
});

const ReviewModal = ({ product_id, reviews }) => {
  const { userData } = useAuth();
  const dispatch = useDispatch();
  const review = reviews.reviews.find((elm) => elm.user_id === userData?.user_id);
  const { reviewExist } = reviews;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { rating: 5, comment: "" },
    validationSchema: reviewSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(createReview({ productId: product_id, ...values })).unwrap();
        toast.success("Review submitted successfully!");
        resetForm();
        setIsOpen(false);
        navigate(0);
      } catch (error) {
        toast.error(error.message || "Failed to submit review");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && <Backdrop />}
      <div>
        <Button onClick={toggleModal}>{reviewExist ? "Edit Review" : "Add Review"}</Button>
      </div>
      <Modal isOpen={isOpen} onClose={toggleModal}>
        <ModalHeader>Write a Review</ModalHeader>
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Label className="mt-4">
              <span>Rating</span>
              <Input
                type="number"
                name="rating"
                min="1"
                max="5"
                className="mt-1"
                valid={formik.touched.rating && !formik.errors.rating}
                error={formik.touched.rating && formik.errors.rating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rating}
              />
              {formik.touched.rating && formik.errors.rating && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.rating}</div>
              )}
            </Label>

            <Label className="mt-4">
              <span>Comment</span>
              <Textarea
                name="comment"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows="4"
                valid={formik.touched.comment && !formik.errors.comment}
                error={formik.touched.comment && formik.errors.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.comment}
              />
              {formik.touched.comment && formik.errors.comment && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.comment}</div>
              )}
            </Label>
          </ModalBody>

          <ModalFooter>
            <div className="hidden sm:block">
              <Button layout="outline" onClick={toggleModal} type="button">
                Cancel
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default ReviewModal;
