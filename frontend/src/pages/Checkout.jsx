import AddressForm from "../components/AddressForm";
import PaymentForm from "../components/PaymentForm";
import useCart from "../hooks/useCart";
import RootLayout from "../layout/RootLayout";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addressData, setAddressData] = useState();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cartData } = useCart();

  useEffect(() => {
    if (!state?.fromCartPage) {
      return navigate("/cart");
    }

    if (cartData.items.length === 0) {
      return navigate("/cart");
    }
  }, [cartData, navigate, state]);

  const nextStep = () =>
    setActiveStep((prevStep) => setActiveStep(prevStep + 1));
  const previousStep = () =>
    setActiveStep((prevStep) => setActiveStep(prevStep - 1));

  const next = (data) => {
    setAddressData(data);
    nextStep();
  };
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      {activeStep === 0 ? (
        <AddressForm next={next} />
      ) : (
        <PaymentForm
          nextStep={nextStep}
          previousStep={previousStep}
          addressData={addressData}
        />
      )}
    </div>
  );
};

export default Checkout;
