import { Button, HelperText, Input, Label, Textarea } from "@windmill/react-ui";
import RootLayout from "../layout/RootLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: contactSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        // You'll need to replace these with your actual EmailJS credentials
        const result = await emailjs.send(
          "service_52raxt8",
          "template_y3klqv8",
          {
            user_name: values.name,
            user_email: values.email,
            message: values.message,
          },
          "CBlc0d-4Enp75R0pt"
        );

        if (result.status === 200) {
          toast.success("Message sent successfully! We'll get back to you soon.");
          resetForm();
        } else {
          toast.error("Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("EmailJS Error:", error);
        toast.error("Failed to send message. Please try again later.");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <RootLayout title="Contact Us">
      <div className="flex items-center justify-center m-auto mt-20">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-full md:w-1/2"
        >
          <h1 className="text-center text-4xl my-4">Contact Us</h1>
          <p className="text-center text-gray-600 mb-6">
            Have a question or feedback? We'd love to hear from you!
          </p>
          
          <div className="mb-4">
            <Label className="block text-grey-darker text-sm font-bold mb-2">
              <span>Name</span>
            </Label>
            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              type="text"
              name="name"
              placeholder="Enter your full name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <HelperText className="mt-1 italic" valid={false}>
                {formik.errors.name}
              </HelperText>
            )}
          </div>

          <div className="mb-4">
            <Label className="block text-grey-darker text-sm font-bold mb-2">
              <span>Email</span>
            </Label>
            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              type="email"
              name="email"
              placeholder="Enter your email address"
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

          <div className="mb-6">
            <Label className="block text-grey-darker text-sm font-bold mb-2">
              <span>Message</span>
            </Label>
            <Textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              name="message"
              placeholder="Enter your message here..."
              rows="5"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
            />
            {formik.touched.message && formik.errors.message && (
              <HelperText className="mt-1 italic" valid={false}>
                {formik.errors.message}
              </HelperText>
            )}
          </div>

          <Button type="submit" disabled={loading || formik.isSubmitting}>
            {loading ? (
              <PulseLoader color={"#0a138b"} size={10} loading />
            ) : (
              <div className="bg-blue-500 h-10 w-56 rounded-2xl flex items-center justify-center">
                <span className="text-white">Send Message</span>
              </div>
            )}
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>We typically respond within 24 hours.</p>
            <p className="mt-2">
              For urgent matters, please call us at{" "}
              <span className="font-semibold">+1 (555) 123-4567</span>
            </p>
          </div>
        </form>
      </div>
    </RootLayout>
  );
};

export default Contact; 