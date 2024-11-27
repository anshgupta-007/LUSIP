import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './../../App';
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { LogOut } from 'lucide-react';

const Logout = () => {
  const { dispatch } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5010";

  const logoutUser = async () => {
    try {
      // Attempt to invalidate the token on the server
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });

      // Clear user context
      dispatch({ type: "USER", payload: null });
      dispatch({ type: "USER_TYPE", payload: null });

      // Clear all authentication-related local storage
      ['user', 'userId', 'jwtoken'].forEach(key => localStorage.removeItem(key));

      // Show success notification
      toast.success("Logged out successfully", {
        toastId: 'logout',
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate to home page
      navigate("/", { replace: true });
    } catch (error) {
      // Handle logout errors
      console.error("Logout failed:", error);
      
      setError("Unable to logout. Please try again.");
      
      // Fallback logout (clear local data even if server call fails)
      dispatch({ type: "USER", payload: null });
      dispatch({ type: "USER_TYPE", payload: null });
      ['user', 'userId', 'jwtoken'].forEach(key => localStorage.removeItem(key));
      
      // Error notification
      toast.error("Logout encountered an issue", {
        toastId: 'logout-error',
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate home after a short delay
      setTimeout(() => navigate("/", { replace: true }), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    logoutUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      {isLoading ? (
        <div className="text-center">
          <LoadingSpinner />
          <div className="mt-4 flex items-center justify-center">
            <LogOut className="mr-2 text-gray-600" />
            <p className="text-gray-600">Logging out...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
};
export default Logout;