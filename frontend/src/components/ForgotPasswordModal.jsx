import {
  Backdrop,
  Button,
  HelperText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@windmill/react-ui";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../store/methods/authMethod";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.authReducer);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmitReset = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(forgotPassword(values.email));
      if (forgotPassword.fulfilled.match(resultAction)) {
        toast.success("Email has been sent successfully.");
        setIsOpen(false);
      } else {
        toast.error(resultAction.payload || "Failed to send reset email");
      }
    } catch (error) {
      toast.error("An error occurred while sending reset email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <>
        {isOpen && <Backdrop />}
        <span
          onClick={() => setIsOpen(!isOpen)}
          className="mb-1 text-sm text-purple-700 cursor-pointer"
        >
          Forgot password?
        </span>
        <Modal isOpen={isOpen} onClose={toggleModal}>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={onSubmitReset}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <ModalHeader>Forgot Password</ModalHeader>
                <ModalBody>
                  <Label>
                    <span className="font-semibold">Email</span>
                    <Field
                      as={Input}
                      name="email"
                      className="mt-1 border py-2 pl-2"
                      valid
                      type="email"
                      inputMode="email"
                    />
                  </Label>
                  {errors.email && touched.email && (
                    <HelperText className="mt-2" valid={false}>
                      {errors.email}
                    </HelperText>
                  )}
                  {error && (
                    <HelperText className="mt-2" valid={false}>
                      {error}
                    </HelperText>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <PulseLoader size={10} color={"#0a138b"} />
                    ) : (
                      "Send email"
                    )}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>
      </>
    </div>
  );
};

export default ForgotPasswordModal;
