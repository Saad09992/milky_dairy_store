import { Button } from "@windmill/react-ui";
import useAuth from "../hooks/useAuth";
import { usePaystackPayment } from "react-paystack";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "react-feather";

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
    <Button 
      onClick={handlePayment} 
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
    >
      <CreditCard className="w-4 h-4" />
      Pay with Paystack
    </Button>
  );
};

export default PaystackBtn;
