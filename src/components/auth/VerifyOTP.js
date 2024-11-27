import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Layers, Key, AlertTriangle } from "lucide-react";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes
  const [canResendOTP, setCanResendOTP] = useState(false);

  // Get the user data from the location state
  const user = location.state?.user;

  // Redirect if no user data
  useEffect(() => {
    if (!user) {
      toast.error("Please complete signup first");
      navigate("/signup");
    }
  }, [user, navigate]);

  // OTP Timer
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendOTP(true);
    }
  }, [remainingTime]);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setOtpError("");
    }
  };

  const resendOTP = async () => {
    if (!canResendOTP) return;

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/sendotp`, 
        user, 
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("New OTP sent successfully");
      setRemainingTime(300);
      setCanResendOTP(false);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndCreateUser = async (e) => {
    e.preventDefault();

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setOtpError("");
    console.log("User",user);
    try {
      // Send OTP and user data to create the account
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`, { ...user, otp }, {
        headers: { "Content-Type": "application/json" },
      });

      setIsLoading(false);
      toast.success("Account created successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.error || 
        "Invalid OTP or registration failed. Please try again.";
      
      setOtpError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="flex justify-center items-center min-h-screen py-8 px-4 bg-gray-100">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <Layers className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Verify Your OTP
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to {user?.email}
              </p>
            </div>

            <form onSubmit={verifyOtpAndCreateUser} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                    ${otpError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {otpError && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>

              {otpError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {otpError}
                </p>
              )}

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Time Remaining:</span>
                <span className={`font-semibold ${remainingTime <= 60 ? 'text-red-500' : ''}`}>
                  {formatTime(remainingTime)}
                </span>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50"
              >
                Verify OTP
              </button>


              <p className="text-center text-sm text-gray-600 mt-4">
                Didn't receive the code? 
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:underline ml-1 font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default VerifyOTP;