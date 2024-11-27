import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { User, Mail, Lock } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType:"Student"
  });

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!user.firstName.trim()) {
      newErrors.firstName = "First name required";
    }
    if (!user.lastName.trim()) {
      newErrors.lastName = "Last name required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email.trim()) {
      newErrors.email = "Email required";
    } else if (!emailRegex.test(user.email)) {
      newErrors.email = "Invalid email";
    }

    // Password validation
    if (!user.password) {
      newErrors.password = "Password required";
    } else if (user.password.length < 8) {
      newErrors.password = "Min 8 characters";
    }

    // Confirm password validation
    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct form errors");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Check if user exists
      const userCheckResponse = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/userpresent`, 
        { email: user.email }, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (userCheckResponse.data.success) {
        toast.error("User already exists");
        setIsLoading(false);
        return;
      }

      // Send OTP
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/sendotp`, 
        user, 
        { headers: { "Content-Type": "application/json" } }
      );

      navigate("/verify-otp", { state: { user } });
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.response) {
        const errorMessage = error.response.data.error || 
                             "Signup failed";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No server response");
      } else {
        toast.error("Signup error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-4 sm:py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
              Create <span className="text-blue-600">Account</span>
            </h2>

            <form onSubmit={requestOtp} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputs}
                    placeholder="First Name"
                    className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                      ${errors.firstName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputs}
                    placeholder="Last Name"
                    className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                      ${errors.lastName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputs}
                  placeholder="Email Address"
                  className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                    ${errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputs}
                    placeholder="Password"
                    className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                      ${errors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleInputs}
                    placeholder="Confirm Password"
                    className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                      ${errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 sm:py-3 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              >
                Create Account
              </button>

              <div className="text-center mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;