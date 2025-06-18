import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    productReducer,
    cartReducer,
    orderReducer,
    reviewReducer
  },
});
