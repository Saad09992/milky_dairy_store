import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  updateUser,
  login,
  register,
} from "../store/methods/authMethod";
import { logout } from "../store/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { userData, token, loggedIn, loading, error } = useSelector(
    (state) => state.authReducer
  );

  useEffect(() => {
    if (loggedIn && !userData) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, loggedIn, userData]);

  const handleLogin = (credentials) => {
    return dispatch(login(credentials));
  };

  const handleRegister = (userData) => {
    return dispatch(register(userData));
  };

  const handleLogout = () => {
    return dispatch(logout());
  };

  const handleUpdateUser = (userData) => {
    console.log(userData);
    return dispatch(updateUser({ userId: userData.user_id, userData }));
  };

  return {
    userData,
    token,
    loggedIn,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: handleUpdateUser,
  };
};

export default useAuth;
