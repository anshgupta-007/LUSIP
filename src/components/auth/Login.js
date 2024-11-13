import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5010/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if(response.data.message === "Password is Incorrect"){
        toast.error("Incorrect Password");
      } else {
        const data = response.data.user;
        toast.success("Login Successful");
        setIsLoading(false);
        navigate("/");
        localStorage.setItem("jwtoken", data.token);
        localStorage.setItem("userId", data._id);
        dispatch({ type: "USER", payload: true });
        dispatch({ type: "USER_TYPE", payload: data.accountType });
      }
    } catch (error) {
      setIsLoading(false);
      setAuthStatus(error.response?.data?.error || "Something Went Wrong");
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-md p-10 bg-white rounded-xl shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Sign <span className="text-indigo-600">In</span>
            </h3>

            <form onSubmit={loginUser}>
              <div className="mb-5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                />
              </div>

              {authStatus && (
                <div className="text-red-600 text-sm font-semibold mb-4">
                  {authStatus}
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <Link to="/passwordReset" className="text-sm text-indigo-500 hover:underline">
                  Forgot Your Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                Login
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="text-indigo-600 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
