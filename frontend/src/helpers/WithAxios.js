import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../store/methods/authMethod";

const WithAxios = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return children;
};

export default WithAxios;
