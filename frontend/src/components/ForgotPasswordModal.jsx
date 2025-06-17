import { Button, HelperText, Label } from "@windmill/react-ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../store/methods/authMethod";
import toast from "react-hot-toast";
import Input from "./ui/Input";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(forgotPassword(values.email)).unwrap();
        toast.success("Password reset email sent!");
        onClose();
      } catch (error) {
        toast.error(error.message || "Failed to send reset email");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Reset Password
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <Label className="block">
                    <span className="text-gray-900 font-medium">Email</span>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      valid={formik.touched.email && !formik.errors.email}
                      error={formik.touched.email && formik.errors.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <HelperText valid={false} className="text-red-600 mt-1">
                        {formik.errors.email}
                      </HelperText>
                    )}
                  </Label>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="w-full sm:w-auto sm:ml-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordModal;
