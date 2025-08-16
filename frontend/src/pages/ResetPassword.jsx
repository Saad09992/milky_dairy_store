import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import { checkToken, resetPassword } from "../store/methods/authMethod";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be greater than 5 characters")
    .required("Password cannot be empty"),
  password2: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.authReducer);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const checkResetToken = async () => {
      try {
        const resultAction = await dispatch(checkToken({ token, email }));
        if (checkToken.fulfilled.match(resultAction)) {
          setMsg(resultAction.payload);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkResetToken();
  }, [dispatch, token, email]);

  const handlePasswordReset = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(
        resetPassword({
          token,
          email,
          password: values.password,
          password2: values.password2,
        })
      );
      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(resultAction.payload || "Password reset failed");
      }
    } catch (error) {
      toast.error("An error occurred during password reset");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RootLayout>
      {msg.showForm ? (
        <div className="pt-12">
          <header className="max-w-lg mx-auto mb-4">
            <h1 className="text-4xl font-bold text-center">Reset Password</h1>
          </header>
          <div className="mx-auto max-w-lg shadow-2xl p-8 md:p-10">
            <Formik
              initialValues={{ password: "", password2: "" }}
              validationSchema={resetPasswordSchema}
              onSubmit={handlePasswordReset}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="flex flex-col">
                  <Label className="mb-4">
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                    </span>
                    <Field
                      as={Input}
                      className="rounded w-full text-gray-700 focus:outline-none border px-2 py-2 focus:border-purple-600 transition duration-500"
                      type="password"
                      inputMode="password"
                      name="password"
                    />
                    {errors.password && touched.password && (
                      <HelperText className="pt-2" valid={false}>
                        {errors.password}
                      </HelperText>
                    )}
                  </Label>
                  <Label className="mb-4">
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      Confirm Password
                    </span>
                    <Field
                      as={Input}
                      className="rounded w-full text-gray-700 focus:outline-none border px-2 py-2 focus:border-purple-600 transition duration-500"
                      type="password"
                      inputMode="password"
                      name="password2"
                    />
                    {errors.password2 && touched.password2 && (
                      <HelperText className="pt-2" valid={false}>
                        {errors.password2}
                      </HelperText>
                    )}
                  </Label>
                  {error && (
                    <HelperText className="pt-2" valid={false}>
                      {error}
                    </HelperText>
                  )}
                  <Button type="submit" disabled={loading || isSubmitting}>
                    {loading ? (
                      <PulseLoader size={10} color={"#0a138b"} />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        <div>{msg.message}</div>
      )}
    </RootLayout>
  );
};

export default ResetPassword;
