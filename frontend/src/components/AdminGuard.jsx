import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";

const AdminGuard = ({ children }) => {
  const navigate = useNavigate();
  const { loggedIn, userData, loading } = useSelector((state) => state.authReducer);

  const isAdmin = userData?.roles?.includes("admin");

  useEffect(() => {
    if (!loading) {
      if (!loggedIn) {
        toast.error("Please login to access admin panel");
        navigate("/login");
        return;
      }

      if (!isAdmin) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }
    }
  }, [loggedIn, userData, loading, navigate, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={100} />
      </div>
    );
  }

  if (!loggedIn || !isAdmin) {
    return null;
  }

  return children;
};

export default AdminGuard; 