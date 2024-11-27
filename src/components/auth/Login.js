import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5010";

  const loginUser = async (e) => {
    e.preventDefault();
    setAuthStatus(""); 
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const { message, user } = response.data;
      console.log(response.data.message);
      if (message === "Fill all Fields") {
        setAuthStatus("Please fill in all fields");
      } else if (message === "User Not Registered") {
        setAuthStatus("Email not Registered");
      } else if (message === "Password Not Matched") {
        setAuthStatus("Incorrect password");
      } else if (user) {
        toast.success("Login successfully");

        localStorage.setItem("jwtoken", response.data?.token || "");
        localStorage.setItem("userId", user?.id || "");

        if (dispatch) {
          dispatch({ type: "USER", payload: true });
          dispatch({ type: "USER_TYPE", payload: user.accountType });
        }

        navigate("/");
      } else {
        setAuthStatus("Unexpected server response");
      }
    } catch (error) {
      setAuthStatus(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                  Welcome <span className="text-blue-600">Back</span>
                </h2>
                <p className="text-gray-500 mt-2">
                  Sign in to continue to your dashboard
                </p>
              </div>

              <form onSubmit={loginUser} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  />
                </div>

                {authStatus && (
                  <div className="text-red-500 text-sm text-center">
                    {authStatus}
                  </div>
                )}

                <div className="flex justify-start items-center">
                  
                  <Link
                    to="/passwordReset"
                    className="text-sm text-blue-600 hover:text-blue-800 transition duration-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102 shadow-lg"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-px w-16 bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">or</span>
                  <div className="h-px w-16 bg-gray-300"></div>
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;