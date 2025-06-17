import {
  Button,
  HelperText,
  Card,
  CardBody,
  CardHeader,
  Input,
  Label,
} from "@windmill/react-ui";
import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import OrderService from "../services/order.service";

const PaymentForm = ({ previousStep, addressData }) => {
  const { cartSubtotal, cartTotal, cartData } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (paymentMethod === "cash") {
      // Validate cash amount
      const amount = parseFloat(cashAmount);
      if (isNaN(amount) || amount < cartSubtotal) {
        setError(`Amount must be at least ${formatCurrency(cartSubtotal)}`);
        return;
      }

      try {
        setIsProcessing(true);
        await OrderService.createOrder(
          cartSubtotal,
          cartTotal,
          "CASH",
          "CASH",
          {
            cashAmount: amount,
            change: amount - cartSubtotal,
          }
        );
        setIsProcessing(false);
        navigate("/cart/success", {
          state: {
            fromPaymentPage: true,
          },
        });
      } catch (error) {
        setIsProcessing(false);
        setError(error.message || "Failed to process order");
      }
    } else {
      // Stripe payment (just for show)
      setError("Stripe payment is not implemented yet");
    }
  };

  return (
    <div className="w-full md:w-1/2">
      <h1 className="text-3xl font-semibold text-center mb-2">Checkout</h1>
      <OrderSummary />

      <div className="mt-6">
        <div className="mb-4">
          <Label className="mb-2">Payment Method</Label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <span>Cash Payment</span>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <span>Stripe Payment (Coming Soon)</span>
            </div>
          </div>
        </div>

        {paymentMethod === "cash" && (
          <Label>
            <span>Cash Amount</span>
            <Input
              type="number"
              step="0.01"
              min={cartSubtotal}
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              placeholder={`Enter amount (minimum ${formatCurrency(
                cartSubtotal
              )})`}
              className="mt-1"
            />
            {error && <HelperText valid={false}>{error}</HelperText>}
            {cashAmount && parseFloat(cashAmount) >= cartSubtotal && (
              <HelperText valid={true}>
                Change: {formatCurrency(parseFloat(cashAmount) - cartSubtotal)}
              </HelperText>
            )}
          </Label>
        )}

        {paymentMethod === "stripe" && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-center">
              Stripe payment integration coming soon!
            </p>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button onClick={previousStep} layout="outline" size="small">
            Back
          </Button>
          <Button
            disabled={isProcessing || (paymentMethod === "cash" && !cashAmount)}
            onClick={handleSubmit}
            size="small"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
