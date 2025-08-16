import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../store/methods/productMethod";
import { setPage } from "../store/slices/productSlice";

const useProduct = () => {
  const dispatch = useDispatch();
  const { products, loading, error, page } = useSelector(
    (state) => state.productReducer
  );

  useEffect(() => {
      dispatch(getProducts(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  return {
    products,
    loading,
    error,
    page,
    setPage: handlePageChange,
  };
};

export default useProduct;
