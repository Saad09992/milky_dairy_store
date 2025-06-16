import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../store/methods/orderMethod";
import { setPage } from "../store/slices/productSlice";

const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, page } = useSelector(
    (state) => state.orderReducer
  );

  useEffect(() => {
    dispatch(getOrders(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  return {
    orders,
    loading,
    error,
    page,
    setPage: handlePageChange,
  };
};

export default useOrders;
