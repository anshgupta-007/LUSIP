import "./App.css";
import { Routes, Route } from "react-router-dom";
import { createContext, useReducer } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import HomePage from "./components/pages/HomePage";
import About from "./components/About";
import AppliedProjects from "./components/pages/AppliedProjects";
import Signup from "./components/auth/Signup";
import Logout from "./components/auth/Logout";
import Login from "./components/auth/Login";
import MyProjects from "./components/pages/MyProjects";
import { initialState, reducer } from "./reducer/UseReducer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Faculties from "./components/pages/Faculties";
import VerifyOTP from "./components/auth/VerifyOTP";
import Requests from "./components/pages/Requests";
import ForgotPassword from "./components/pages/ForgotPassword";
import UpdatePassword from "./components/pages/UpdatePassword";

export const UserContext = createContext();

const App = () => {
  const token = localStorage.getItem("jwtoken");

  // Set the default authorization header for axios
  axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  axios.defaults.withCredentials = true;

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className=" bg-zinc-100 bg-[#f0e6d7] min-h-[100vh]">
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />
        <Routes>
        <Route path="/" element={state.userType === "Student" ? <HomePage /> : state.userType === "Instructor" ? <HomePage /> : <HomePage/>} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<About />} />
          <Route path="/appliedprojects" element={<AppliedProjects />} />
          <Route path="/myProjects" element={<MyProjects />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/passwordReset" element={<ForgotPassword />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/update-password/:token" element={<UpdatePassword />} />
        </Routes>
        {/* ToastContainer component to enable toast notifications */}
        <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </UserContext.Provider>
    </div>
  );
};

export default App;
