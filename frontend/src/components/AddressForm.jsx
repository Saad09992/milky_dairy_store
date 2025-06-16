import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/methods/authMethod";
import toast from "react-hot-toast";

const addressSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
});

const AddressForm = ({ next }) => {
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
        // Call the next function to move to payment step
        next(values);
      } catch (error) {
        toast.error(error.message || "Failed to update address");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full md:w-1/2">
      <h1 className="text-3xl font-semibold text-center mb-2">Shipping Address</h1>
      <Label className="mt-4">
        <span>Address</span>
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
          <HelperText valid={false}>{formik.errors.address}</HelperText>
        )}
      </Label>

      <Label className="mt-4">
        <span>City</span>
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
          <HelperText valid={false}>{formik.errors.city}</HelperText>
        )}
      </Label>

      <Label className="mt-4">
        <span>State</span>
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
          <HelperText valid={false}>{formik.errors.state}</HelperText>
        )}
      </Label>

      <Label className="mt-4">
        <span>Country</span>
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
          <HelperText valid={false}>{formik.errors.country}</HelperText>
        )}
      </Label>

      <div className="mt-6">
        <Button type="submit" disabled={formik.isSubmitting} className="w-full">
          {formik.isSubmitting ? "Updating..." : "Continue to Payment"}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
