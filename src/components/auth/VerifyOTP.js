import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the user data from the location state
  const user = location.state?.user;

  const handleOtpChange = (e) => setOtp(e.target.value);

  const verifyOtpAndCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send OTP and user data to create the account
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`, { ...user, otp }, {
        headers: { "Content-Type": "application/json" },
      });

      setIsLoading(false);
      toast.success("Account verified successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("Invalid OTP or registration failed. Please try again.");
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="flex justify-center items-center min-h-screen py-8 px-4 bg-gray-100">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Verify Your OTP</h2>
            <form onSubmit={verifyOtpAndCreateUser}>
              <div className="mb-4">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter OTP</label>
                <input
                  required
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  name="otp"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  placeholder="Enter OTP"
                />
              </div>

              <button type="submit" className="w-full py-3 text-white font-semibold bg-gray-800 rounded-md hover:bg-gray-700 transition duration-200">
                Verify OTP
              </button>

              <p className="text-center mt-4 text-sm text-gray-600">
                If you didn't receive the OTP, <Link to="/signup" className="text-indigo-600 hover:underline">SignUp again</Link>.
              </p>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default VerifyOTP;
