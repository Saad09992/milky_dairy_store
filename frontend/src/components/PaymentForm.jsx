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
  const { cartSubtotal, cartTotal, cartData, setCartData } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate cash amount
    const amount = parseFloat(cashAmount);
    if (isNaN(amount) || amount < cartSubtotal) {
      setError(`Amount must be at least ${formatCurrency(cartSubtotal)}`);
      return;
    }

    try {
      setIsProcessing(true);
      await OrderService.createOrder(cartSubtotal, cartTotal, "CASH", "CASH", {
        cashAmount: amount,
        change: amount - cartSubtotal
      });
      setCartData({ ...cartData, items: [] });
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
  };

  return (
    <div className="w-full md:w-1/2">
      <h1 className="text-3xl font-semibold text-center mb-2">Checkout</h1>
      <OrderSummary />
      
      <div className="mt-6">
        <Label>
          <span>Cash Amount</span>
          <Input
            type="number"
            step="0.01"
            min={cartSubtotal}
            value={cashAmount}
            onChange={(e) => setCashAmount(e.target.value)}
            placeholder={`Enter amount (minimum ${formatCurrency(cartSubtotal)})`}
            className="mt-1"
          />
          {error && <HelperText valid={false}>{error}</HelperText>}
          {cashAmount && parseFloat(cashAmount) >= cartSubtotal && (
            <HelperText valid={true}>
              Change: {formatCurrency(parseFloat(cashAmount) - cartSubtotal)}
            </HelperText>
          )}
        </Label>

        <div className="flex justify-between mt-4">
          <Button onClick={previousStep} layout="outline" size="small">
            Back
          </Button>
          <Button
            disabled={isProcessing || !cashAmount}
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
