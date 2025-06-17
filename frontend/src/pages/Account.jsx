import { Button, HelperText, Label } from "@windmill/react-ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/methods/authMethod";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Input from "../components/ui/Input";
import ProfileSection from "../components/ProfileSection";
import AddressForm from "../components/AddressForm";

const userSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const Account = () => {
  const { userData } = useAuth();
  const dispatch = useDispatch();

  // Split fullname into first and last name
  const [firstName, lastName] = (userData?.fullname || "").split(" ");

  const formik = useFormik({
    initialValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      email: userData?.email || "",
    },
    validationSchema: userSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedData = {
          ...userData,
          fullname: `${values.firstName} ${values.lastName}`,
          email: values.email,
        };
        await dispatch(
          updateUser({ userId: userData.user_id, userData: updatedData })
        ).unwrap();
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to update profile");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <ProfileSection
            title="Personal Information"
            description="Update your personal details"
            icon="user"
            color="blue"
          >
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Label className="block">
                  <span className="text-gray-900 font-medium">First Name</span>
                  <Input
                    name="firstName"
                    placeholder="Enter your first name"
                    valid={formik.touched.firstName && !formik.errors.firstName}
                    error={formik.touched.firstName && formik.errors.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <HelperText valid={false} className="text-red-600 mt-1">
                      {formik.errors.firstName}
                    </HelperText>
                  )}
                </Label>

                <Label className="block">
                  <span className="text-gray-900 font-medium">Last Name</span>
                  <Input
                    name="lastName"
                    placeholder="Enter your last name"
                    valid={formik.touched.lastName && !formik.errors.lastName}
                    error={formik.touched.lastName && formik.errors.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <HelperText valid={false} className="text-red-600 mt-1">
                      {formik.errors.lastName}
                    </HelperText>
                  )}
                </Label>
              </div>

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

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </ProfileSection>

          <ProfileSection
            title="Address Information"
            description="Update your delivery address"
            icon="map-pin"
            color="purple"
          >
            <AddressForm />
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};

export default Account;
