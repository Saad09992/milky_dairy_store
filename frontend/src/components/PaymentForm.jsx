import {
  Button,
  HelperText,
  Label,
} from "@windmill/react-ui";
import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import OrderService from "../services/order.service";
import { CreditCard, DollarSign } from "react-feather";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createOrder } from "../store/methods/orderMethod";
import toast from "react-hot-toast";
import Input from "./ui/Input";

const PaymentForm = ({ previousStep, addressData }) => {
  const { cartSubtotal, cartTotal, cartData } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      paymentMethod: "cash",
      cashAmount: cartTotal,
    },
    validationSchema: Yup.object({
      cashAmount: Yup.number()
        .min(cartSubtotal, `Amount must be at least ${formatCurrency(cartSubtotal)}`)
        .required("Cash amount is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const orderData = {
          address: addressData,
          paymentMethod: values.paymentMethod,
          cashAmount: values.cashAmount,
          total: cartTotal,
        };
        await dispatch(createOrder(orderData)).unwrap();
        toast.success("Order placed successfully!");
        navigate("/cart/success", {
          state: {
            fromPaymentPage: true,
          },
        });
      } catch (error) {
        toast.error(error.message || "Failed to place order");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <OrderSummary />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formik.values.paymentMethod === "cash"}
                onChange={formik.handleChange}
                className="form-radio text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Cash Payment</span>
              </div>
            </label>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={formik.values.paymentMethod === "stripe"}
                onChange={formik.handleChange}
                className="form-radio text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Stripe Payment (Coming Soon)</span>
              </div>
            </label>
          </div>

          {formik.values.paymentMethod === "cash" && (
            <div className="space-y-4">
              <Label>
                <span className="text-gray-900 font-medium">Cash Amount</span>
                <Input
                  type="number"
                  name="cashAmount"
                  placeholder="Enter cash amount"
                  valid={formik.touched.cashAmount && !formik.errors.cashAmount}
                  error={formik.touched.cashAmount && formik.errors.cashAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cashAmount}
                />
                {formik.touched.cashAmount && formik.errors.cashAmount && (
                  <HelperText valid={false} className="text-red-600 mt-1">
                    {formik.errors.cashAmount}
                  </HelperText>
                )}
              </Label>
            </div>
          )}

          {formik.values.paymentMethod === "stripe" && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-center font-medium">
                Stripe payment integration coming soon!
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button 
              onClick={previousStep} 
              layout="outline" 
              size="small"
              className="hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              Back
            </Button>
            <Button
              disabled={formik.isSubmitting || (formik.values.paymentMethod === "cash" && !formik.values.cashAmount)}
              type="submit"
              size="small"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
