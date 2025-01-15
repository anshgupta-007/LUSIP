import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import logo from "../assets/lnmiit.png";

const Navbar = () => {
  const { state } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const RenderUser = () => {
    if (state.userType === "Instructor") {
      return (
        <div className="flex flex-col items-center md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <Link to="/myprojects" className="hover:text-indigo-600 transition-colors">My Projects</Link>
          <Link to="/requests" className="hover:text-indigo-600 transition-colors">Requests</Link>
        </div>
      );
    } else if (state.userType === "Student") {
      return (
        <div className="text-center">
          <Link to="/appliedprojects" className="hover:text-indigo-600 transition-colors">Applied Projects</Link>
        </div>
      );
    } else if (state.userType === "Admin") {
      return (
        <div className="text-center">
          <Link to="/faculties" className="hover:text-indigo-600 transition-colors">Faculties</Link>
        </div>
      );
    } else {
      return null;
    }
  };

  const RenderMenu = () => {
    if (state.user) {
      return (
        <Link to="/logout" className="inline-block">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Logout
          </button>
        </Link>
      );
    } else {
      return (
        <Link to="/login" className="inline-block">
          <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
            Sign In / Sign Up
          </button>
        </Link>
      );
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img className="h-10 w-auto" src={logo} alt="Logo" />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6 transform transition-transform duration-200 rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {state.user && (
              <Link to="/projects" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Projects
              </Link>
            )}
            <div className="text-gray-700">
              <RenderUser />
            </div>
            {state.user && (
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Profile
              </Link>
            )}
            <RenderMenu />
          </div>
        </div>

        {/* Mobile Menu with Animation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 px-2 pt-2 pb-3 transform transition-transform duration-300 ease-in-out">
            {state.user && (
              <Link 
                to="/projects" 
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
              >
                Projects
              </Link>
            )}
            <div className="text-gray-700">
              <RenderUser />
            </div>
            {state.user && (
              <Link 
                to="/profile" 
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
              >
                Profile
              </Link>
            )}
            <div className="pt-4 pb-3 border-t border-gray-200 w-full text-center">
              <RenderMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;