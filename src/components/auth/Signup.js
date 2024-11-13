import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState("");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accountType: "",
    institution: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/sendotp`, user, {
        headers: { "Content-Type": "application/json" },
      });

      setIsLoading(false);
      toast.success("OTP sent to your email. Please verify.");
      navigate("/verify-otp", { state: { user } });
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 422) {
        setAuthStatus(error.response.data.error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Create Your <span className="text-indigo-500">Account</span>
            </h2>
            <form onSubmit={requestOtp}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    required
                    type="text"
                    value={user.firstName}
                    onChange={handleInputs}
                    name="firstName"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    required
                    type="text"
                    value={user.lastName}
                    onChange={handleInputs}
                    name="lastName"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  required
                  type="email"
                  value={user.email}
                  onChange={handleInputs}
                  name="email"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  placeholder="Email"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="accountType" className="text-sm font-medium text-gray-700">Account Type</label>
                <select
                  required
                  name="accountType"
                  value={user.accountType}
                  onChange={handleInputs}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                >
                  <option value="">Select Account Type</option>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    required
                    type="password"
                    value={user.password}
                    onChange={handleInputs}
                    name="password"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    required
                    type="password"
                    value={user.confirmPassword}
                    onChange={handleInputs}
                    name="confirmPassword"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-6 text-white font-semibold bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-200 shadow-sm hover:shadow-lg"
              >
                Sign Up
              </button>

              <p className="text-center mt-6 text-sm text-gray-500">
                Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Login</Link>
              </p>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Signup;
