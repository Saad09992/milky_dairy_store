import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import RootLayout from "../layout/RootLayout";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/methods/authMethod";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const { loggedIn, loading, error } = useSelector(
    (state) => state.authReducer
  );
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { state } = useLocation();

  // Set document title
  useEffect(() => {
    document.title = "Login | Milky Dairy";
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(login(values));
      } catch (error) {
        toast.error("An error occurred during login");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (redirectToReferrer) {
    return <Navigate to={state?.from || "/"} />;
  }
  if (loggedIn) {
    return <Navigate to={state?.from || "/"} />;
  }

  return (
    <div className="flex items-center justify-center m-auto mt-20">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-full md:w-1/2"
      >
        <h1 className="text-center text-4xl my-4">Continue Shopping</h1>
        <div className="">
          <Label className="block text-grey-darker text-sm font-bold mb-2">
            <span>Email</span>
          </Label>
          <Input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            type="email"
            name="email"
            placeholder="Enter a valid email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <HelperText className="mt-1 italic" valid={false}>
              {formik.errors.email}
            </HelperText>
          )}
        </div>
        <div className="mt-4">
          <Label className="block text-grey-darker text-sm font-bold mb-2">
            <span>Password</span>
          </Label>
          <Input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <HelperText className="mt-1 italic" valid={false}>
              {formik.errors.password}
            </HelperText>
          )}
        </div>
        {error && (
          <HelperText className="mt-1 italic" valid={false}>
            {error}
          </HelperText>
        )}
        <div className="mt-4">
          <ForgotPasswordModal />
        </div>
        <Button type="submit" disabled={loading || formik.isSubmitting}>
          {loading ? (
            <PulseLoader color={"#0a138b"} size={10} loading />
          ) : (
            <div className="bg-blue-500 h-10 w-56 rounded-2xl flex items-center justify-center">
              <span className="text-white">Login</span>
            </div>
          )}
        </Button>
        <p className="text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-bold">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
