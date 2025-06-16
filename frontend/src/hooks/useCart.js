import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeCart,
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../store/methods/cartMethod";
import {
  selectCartData,
  selectCartSubtotal,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
} from "../store/slices/cartSlice";

const useCart = () => {
  const dispatch = useDispatch();
  const cartData = useSelector(selectCartData);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const cartTotal = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const isLoggedIn = useSelector((state) => state.authReducer.loggedIn);

  useEffect(() => {
    dispatch(initializeCart(isLoggedIn));
  }, [dispatch, isLoggedIn]);

  const handleAddItem = async (product, quantity) => {
    return dispatch(addToCart({ product, quantity, isLoggedIn }));
  };

  const handleDeleteItem = (product_id) => {
    return dispatch(removeFromCart({ product_id, isLoggedIn }));
  };

  const handleIncrement = (product_id) => {
    return dispatch(incrementQuantity({ product_id, isLoggedIn }));
  };

  const handleDecrement = (product_id) => {
    return dispatch(decrementQuantity({ product_id, isLoggedIn }));
  };

  return {
    cartData,
    cartSubtotal,
    cartTotal,
    loading,
    error,
    addItem: handleAddItem,
    deleteItem: handleDeleteItem,
    increment: handleIncrement,
    decrement: handleDecrement,
  };
};

export default useCart;
