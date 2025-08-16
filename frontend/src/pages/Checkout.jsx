import PaymentForm from "../components/PaymentForm";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import RootLayout from "../layout/RootLayout";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { MapPin, Edit2 } from "react-feather";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cartData } = useCart();
  const { userData } = useAuth();

  useEffect(() => {
    if (!state?.fromCartPage) {
      return navigate("/cart");
    }

    if (cartData.items.length === 0) {
      return navigate("/cart");
    }
  }, [cartData, navigate, state]);

  const nextStep = () =>
    setActiveStep((prevStep) => prevStep + 1);
  const previousStep = () =>
    setActiveStep((prevStep) => prevStep - 1);

  return (
    <RootLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-dairy-text">
          Checkout
        </h1>

        {activeStep === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dairy-primary/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-dairy-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Address
                </h2>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-dairy-primary hover:text-dairy-primary/80 hover:bg-dairy-primary/10 rounded-lg transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Update Address
              </Link>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-900 font-medium">
                  {userData?.fullname}
                </p>
                <p className="text-gray-600 mt-1">{userData?.address}</p>
                <p className="text-gray-600">
                  {userData?.city}, {userData?.state} {userData?.zipcode}
                </p>
                <p className="text-gray-600">{userData?.phone}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={nextStep}
                  className="w-full bg-gradient-dairy text-white hover:bg-gradient-dairy-hover transition-all duration-200 shadow-sm hover:shadow-md py-2.5 rounded-lg font-medium"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <PaymentForm
            nextStep={nextStep}
            previousStep={previousStep}
            addressData={userData}
          />
        )}
      </div>
    </RootLayout>
  );
};

export default Checkout;
