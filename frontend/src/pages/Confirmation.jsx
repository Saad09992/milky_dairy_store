import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import RootLayout from "../layout/RootLayout";

const Confirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();

  useEffect(() => {
    if (!state?.fromPaymentPage) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  return (
    <RootLayout>
      <div className="container py-20 mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-4">Order Confirmed!</h1>
        <p className="text-center mb-4">
          Thank you for your order, {userData?.fullname?.split(" ")[0]}!
        </p>
        <p className="text-center">
          We have sent a confirmation email to {userData?.email}
        </p>
      </div>
    </RootLayout>
  );
};

export default Confirmation;
