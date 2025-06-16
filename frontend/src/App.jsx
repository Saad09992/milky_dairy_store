import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import RootLayout from "./layout/RootLayout";
import Spinner from "./components/Spinner";
import {
  Account,
  ProductList,
  ProductDetails,
  Cart,
  Register,
  Login,
  Confirmation,
  Orders,
  OrderDetails,
  ResetPassword,
  NotFound,
  Checkout,
} from "./pages";
import WithAxios from "./helpers/WithAxios";

function App() {
  const { loggedIn } = useSelector((state) => state.authReducer);

  return (
    <Router>
      <WithAxios>
        <RootLayout>
          <Suspense fallback={<Spinner size={100} />}>
            <Toaster position="top-right" />
            <Routes>
              {loggedIn ? (
                <>
                  <Route path="/profile" element={<Account />} />
                  <Route path="/cart/checkout" element={<Checkout />} />
                  <Route path="/cart/success" element={<Confirmation />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id/" element={<OrderDetails />} />
                </>
              ) : (
                ""
              )}

              <Route path="/signup" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route index element={<ProductList />} />
              <Route path="/products/:slug/" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </Suspense>
        </RootLayout>
      </WithAxios>
    </Router>
  );
}

export default App;
