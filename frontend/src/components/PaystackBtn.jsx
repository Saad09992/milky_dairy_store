import { Button } from "@windmill/react-ui";
import useAuth from "../hooks/useAuth";
import { usePaystackPayment } from "react-paystack";
import { useNavigate } from "react-router-dom";

const PaystackBtn = ({ amount, email, onSuccess, onClose }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const config = {
    reference: new Date().getTime().toString(),
    email: email || userData?.email,
    amount: amount * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!userData) {
      navigate("/login");
      return;
    }
    initializePayment(onSuccess, onClose);
  };

  return (
    <Button onClick={handlePayment} className="w-full">
      Pay with Paystack
    </Button>
  );
};

export default PaystackBtn;
