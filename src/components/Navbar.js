import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import logo from "../assets/lnmiit.png";

const Navbar = () => {
  const { state } = useContext(UserContext);

  const toggleMenu = () => {
    document.getElementById("menu").classList.toggle("hidden");
  };

  const RenderUser = () => {
    console.log("Full state", state);
    if (state.userType === "Instructor") {
      return (
        <div>
          <Link to="/myprojects">My Projects</Link>
          <Link to="/requests" className="ml-8">Request</Link> {/* New link */}
        </div>
      );
    } else if (state.userType === "Student") {
      return (
        <div>
          <Link to="/appliedprojects">Applied Projects</Link>
        </div>
      );
    } else if (state.userType === "Admin") {
      return (
        <div>
          <Link to="/faculties">Faculties</Link>
        </div>
      );
    } else {
      return null;
    }
  };

  const RenderMenu = () => {
    if (state.user) {
      return (
        <>
          <Link to="/logout">
            <button className="focus:outline-none lg:text-lg lg:font-bold focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 md:block bg-transparent transition duration-150 ease-in-out hover:bg-gray-200 rounded border border-indigo-700 text-indigo-700 px-8 py-1 sm:py-3 text-sm">
              Logout
            </button>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/login">
            <button className="focus:outline-none lg:text-lg font-bold focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 md:block bg-transparent transition duration-150 ease-in-out hover:bg-gray-200 rounded border border-indigo-700 text-indigo-700 px-8 py-1 sm:py-3 text-sm">
              Sign In / Sign Up
            </button>
          </Link>
        </>
      );
    }
  };

  return (
    <>
      <nav className="w-full bg-white  border-b-2 border-gray-300">
        <div className="py-5 md:py-0 container mx-auto px-6 flex items-center justify-between">
          <Link to={"/"}>
            <div aria-label="Home. logo" className="flex justify-between items-center" role="img">
              <img className="w-24 md:w-36" src={logo} alt="logo" />
            </div>
          </Link>

          <div>
            <button onClick={toggleMenu} className="sm:block md:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              <svg aria-haspopup="true" aria-label="open Main Menu" xmlns="http://www.w3.org/2000/svg" className="md:hidden icon icon-tabler icon-tabler-menu" width="32" height="32" viewBox="0 0 32 32" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round">
                <path stroke="none" d="M0 0h24v24H0z"></path>
                <line x1="4" y1="8" x2="20" y2="8"></line>
                <line x1="4" y1="16" x2="20" y2="16"></line>
                <line x1="4" y1="24" x2="20" y2="24"></line>
              </svg>
            </button>
            <div id="menu" className="md:block lg:block hidden">
              <button onClick={toggleMenu} className="block md:hidden lg:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 fixed focus:outline-none focus:ring-2 focus:ring-gray-500 z-30 top-0 mt-6">
                <svg aria-label="close main menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <ul onClick={toggleMenu} className="flex text-3xl md:text-base items-center py-10 md:flex flex-col md:flex-row justify-center fixed md:relative top-0 bottom-0 left-0 right-0 bg-white md:bg-transparent z-20">
              {state.user && (
                  <li className="text-gray-700 hover:text-gray-900 cursor-pointer text-base lg:text-lg pt-10 md:pt-0 md:ml-5 lg:ml-10">
                    <Link to="/projects">Projects</Link>
                  </li>
                )}

                <li className="text-gray-700 hover:text-gray-900 cursor-pointer text-base lg:text-lg pt-10 md:pt-0 md:ml-5 lg:ml-10">
                  <RenderUser />
                </li>

                {state.user && (
                  <li className="text-gray-700 hover:text-gray-900 cursor-pointer text-base lg:text-lg pt-10 md:pt-0 md:ml-5 lg:ml-10">
                    <Link to="/profile">Profile</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <RenderMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
