import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import RootLayout from "../layout/RootLayout";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/methods/authMethod";

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be greater than 3 characters")
    .required("Username is required"),
  name: Yup.string()
    .min(6, "Name must be greater than 5 characters")
    .required("Name cannot be empty"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be greater than 5 characters")
    .required("Password is required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const { loggedIn, loading, error } = useSelector(
    (state) => state.authReducer
  );
  const { state } = useLocation();

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      password2: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { password, password2, username, name, email } = values;
      if (password === password2) {
        try {
          const resultAction = await dispatch(
            register({ username, email, password, fullname: name })
          );
          if (register.fulfilled.match(resultAction)) {
            toast.success("Account created successfully.");
          } else {
            toast.error(resultAction.payload || "Registration failed");
          }
        } catch (error) {
          toast.error("An error occurred during registration");
        } finally {
          setSubmitting(false);
        }
      } else {
        toast.error("Passwords don't match");
        setSubmitting(false);
      }
    },
  });

  if (loggedIn) {
    return <Navigate to={state?.from || "/"} />;
  }

  return (
    <RootLayout title="Create account">
      <div className="flex items-center justify-center mx-auto mt-20 ">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-full md:w-1/2 mx-2"
        >
          <h1 className="text-center text-4xl">Create Account</h1>
          <div className="mt-4">
            <Label className="block text-grey-darker text-sm font-bold mb-2">
              <span>Username</span>
            </Label>
            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              type="text"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <HelperText className="pt-2" valid={false}>
                {formik.errors.username}
              </HelperText>
            )}
          </div>
          <div className="mt-4">
            <Label className="block text-grey-darker text-sm font-bold mb-2">
              <span>Fullname</span>
            </Label>
            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <HelperText className="pt-2" valid={false}>
                {formik.errors.name}
              </HelperText>
            )}
          </div>
          <div className="mt-4">
            <Label className="block text-grey-darker text-sm font-bold mb-2">
              <span>Email</span>
            </Label>
            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <HelperText className="pt-2" valid={false}>
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
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <HelperText className="pt-2" valid={false}>
                {formik.errors.password}
              </HelperText>
            )}
          </div>
          <div className="mt-4">
            <Label className="block text-grey-darker text-sm font-bold mb-2">
              <span>Confirm Password</span>
            </Label>
            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              type="password"
              name="password2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password2}
            />
            {formik.touched.password2 && formik.errors.password2 && (
              <HelperText className="pt-2" valid={false}>
                {formik.errors.password2}
              </HelperText>
            )}
          </div>
          <Button
            type="submit"
            className="mt-4"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? (
              <PulseLoader color={"#0a138b"} size={10} loading={loading} />
            ) : (
              <div className="bg-blue-500 h-10 w-56 rounded-2xl flex items-center justify-center">
                <span className="text-white">Create Account</span>
              </div>
            )}
          </Button>
          {error && (
            <HelperText className="pt-2" valid={false}>
              {error}
            </HelperText>
          )}
          <p className="text-sm mt-4">
            Have an account?{" "}
            <Link to="/login" className="font-bold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </RootLayout>
  );
};

export default Register;
