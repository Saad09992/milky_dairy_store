import { Button, HelperText, Label } from "@windmill/react-ui";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/methods/authMethod";
import toast from "react-hot-toast";
import Input from "./ui/Input";

const addressSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
});

const AddressForm = ({ next, isCheckout = false }) => {
  const { userData } = useAuth();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      address: userData?.address || "",
      city: userData?.city || "",
      state: userData?.state || "",
      country: userData?.country || "",
    },
    validationSchema: addressSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedData = {
          ...userData,
          ...values
        };
        await dispatch(
          updateUser({ userId: userData.user_id, userData: updatedData })
        ).unwrap();
        toast.success("Address updated successfully!");
        if (next) {
          next(values);
        }
      } catch (error) {
        toast.error(error.message || "Failed to update address");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <Label className="block">
          <span className="text-gray-900 font-medium">Address</span>
          <Input
            name="address"
            placeholder="Enter your address"
            valid={formik.touched.address && !formik.errors.address}
            error={formik.touched.address && formik.errors.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
          />
          {formik.touched.address && formik.errors.address && (
            <HelperText valid={false} className="text-red-600 mt-1">
              {formik.errors.address}
            </HelperText>
          )}
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Label className="block">
            <span className="text-gray-900 font-medium">City</span>
            <Input
              name="city"
              placeholder="Enter your city"
              valid={formik.touched.city && !formik.errors.city}
              error={formik.touched.city && formik.errors.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
            />
            {formik.touched.city && formik.errors.city && (
              <HelperText valid={false} className="text-red-600 mt-1">
                {formik.errors.city}
              </HelperText>
            )}
          </Label>

          <Label className="block">
            <span className="text-gray-900 font-medium">State</span>
            <Input
              name="state"
              placeholder="Enter your state"
              valid={formik.touched.state && !formik.errors.state}
              error={formik.touched.state && formik.errors.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.state}
            />
            {formik.touched.state && formik.errors.state && (
              <HelperText valid={false} className="text-red-600 mt-1">
                {formik.errors.state}
              </HelperText>
            )}
          </Label>
        </div>

        <Label className="block">
          <span className="text-gray-900 font-medium">Country</span>
          <Input
            name="country"
            placeholder="Enter your country"
            valid={formik.touched.country && !formik.errors.country}
            error={formik.touched.country && formik.errors.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.country}
          />
          {formik.touched.country && formik.errors.country && (
            <HelperText valid={false} className="text-red-600 mt-1">
              {formik.errors.country}
            </HelperText>
          )}
        </Label>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={formik.isSubmitting} 
            className="w-full bg-gradient-dairy text-white hover:bg-gradient-dairy-hover transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Updating..." : isCheckout ? "Continue to Payment" : "Update Address"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddressForm;
