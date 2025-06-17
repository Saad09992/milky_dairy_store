import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/methods/authMethod";
import toast from "react-hot-toast";

const accountSchema = Yup.object().shape({
  fullname: Yup.string().required("Full name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const AccountForm = () => {
  const { userData } = useAuth();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      fullname: userData?.fullname || "",
      username: userData?.username || "",
      email: userData?.email || "",
    },
    validationSchema: accountSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Include all existing user data and update with new values
        const updatedData = {
          ...userData,
          ...values
        };
        await dispatch(
          updateUser({ userId: userData.user_id, userData: updatedData })
        ).unwrap();
        toast.success("Account updated successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to update account");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <Label className="block">
        <span className="text-gray-900 font-medium">Full Name</span>
        <Input
          name="fullname"
          placeholder="Enter your full name"
          valid={formik.touched.fullname && !formik.errors.fullname}
          error={formik.touched.fullname && formik.errors.fullname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.fullname}
          className="mt-2 block w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-200 bg-white shadow-sm"
        />
        {formik.touched.fullname && formik.errors.fullname && (
          <HelperText valid={false} className="text-red-600 mt-1">
            {formik.errors.fullname}
          </HelperText>
        )}
      </Label>

      <Label className="block">
        <span className="text-gray-900 font-medium">Username</span>
        <Input
          name="username"
          placeholder="Enter your username"
          valid={formik.touched.username && !formik.errors.username}
          error={formik.touched.username && formik.errors.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          className="mt-2 block w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-200 bg-white shadow-sm"
        />
        {formik.touched.username && formik.errors.username && (
          <HelperText valid={false} className="text-red-600 mt-1">
            {formik.errors.username}
          </HelperText>
        )}
      </Label>

      <Label className="block">
        <span className="text-gray-900 font-medium">Email</span>
        <Input
          name="email"
          placeholder="Enter your email"
          valid={formik.touched.email && !formik.errors.email}
          error={formik.touched.email && formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="mt-2 block w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-200 bg-white shadow-sm"
        />
        {formik.touched.email && formik.errors.email && (
          <HelperText valid={false} className="text-red-600 mt-1">
            {formik.errors.email}
          </HelperText>
        )}
      </Label>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={formik.isSubmitting} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Updating..." : "Update Account"}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;
