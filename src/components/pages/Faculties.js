import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, PlusCircle, AlertTriangle, XCircle } from "lucide-react";

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const [buttonName,setButtonName]=useState("Add Faculty");
  const [error, setError] = useState(null);
  const [newFaculty, setNewFaculty] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/getAllFaculties`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        
        if (response.data.faculties) {
          setFaculties(response.data.faculties);
        } else {
          toast.info("No faculty found");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        toast.error("Failed to fetch faculty data.");
        setError("Unable to load faculty data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setAuthStatus("");
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAuthStatus("");
    setError(null);
    setNewFaculty({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty((prev) => ({ ...prev, [name]: value }));
    setAuthStatus("");
    setError(null);
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    setAuthStatus("");
    setError(null);

    // Comprehensive Client-Side Validation
    if (!newFaculty.firstName.trim()) {
      setError("First Name is required");
      return;
    }

    if (!newFaculty.lastName.trim()) {
      setError("Last Name is required");
      return;
    }

    if (!newFaculty.email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(newFaculty.email)) {
      setError("Invalid email format");
      return;
    }

    if (!newFaculty.password) {
      setError("Password is required");
      return;
    }

    if (!validatePassword(newFaculty.password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newFaculty.password !== newFaculty.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setButtonName("Adding...");
      const userCheckResponse = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/userpresent`, 
        { email: newFaculty.email }, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (userCheckResponse.data.success) {
        setError("User Already Present");
        return;
      }
    } catch (err) {
      console.error("Error checking user:", err);
      toast.error("An error occurred while checking the user.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/createFacultybyAdmin`, 
        newFaculty, 
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      
      setFaculties((prev) => [...prev, response.data.faculty]);
      toast.success("Faculty added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error adding new faculty:", error);
      setError("Failed to add faculty. Please try again.");
    }
    setButtonName("Add Faculty");
  };

  const handleDeleteFaculty = async (facultyId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this faculty?");
    if (isConfirmed) {
      try {
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteFaculty/${facultyId}`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        toast.success("Faculty deleted successfully!");
        setFaculties(faculties.filter((faculty) => faculty.id !== facultyId));
      } catch (error) {
        console.error("Error deleting faculty:", error.message);
        toast.error("Failed to delete faculty.");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-100">
      <ToastContainer 
        position="bottom-left" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

<div className="w-full relative mb-6 md:mb-10">
      {/* Title container - always centered */}
      <div className="w-full text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold text-indigo-700">
          Faculty Management
        </h1>
      </div>
      
      {/* Button container - absolute positioning on desktop */}
      <div className="flex justify-center mt-4 md:mt-0 md:absolute md:top-0 md:right-0">
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 md:px-4 md:py-2 rounded hover:bg-indigo-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="hidden md:inline">Add Faculty</span>
          <span className="md:hidden">Add</span>
        </button>
      </div>
    </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-xl text-red-600">{error}</p>
        </div>
      ) : faculties.length > 0 ? (
        <div className="overflow-x-auto max-w-7xl mx-auto">
          <table className="w-full table-auto bg-white border border-gray-200 shadow-lg rounded-lg min-w-ful">
            <thead className="bg-indigo-200 text-indigo-800">
              <tr>
                <th className="py-2 px-2 md:py-3 md:px-6 text-left">Full Name</th>
                {/* <th className="py-2 px-2 md:py-3 md:px-6 text-left">Last Name</th> */}
                <th className="py-2 px-2 md:py-3 md:px-6 text-left  md:table-cell">Email</th>
                <th className="py-2 px-2 md:py-3 md:px-6 text-left hidden md:table-cell">Account Type</th>
                <th className="py-2 px-2 md:py-3 md:px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-2 md:py-3 md:px-6">{faculty.firstName}{" "}{faculty.lastName}</td>
                  {/* <td className="py-2 px-2 md:py-3 md:px-6">{faculty.lastName}</td> */}
                  <td className="py-2 px-2 md:py-3 md:px-6  md:table-cell">{faculty.email}</td>
                  <td className="py-2 px-2 md:py-3 md:px-6 hidden md:table-cell">{faculty.accountType}</td>
                  <td className="py-2 px-2 md:py-3 md:px-6">
                    <button
                      onClick={() => handleDeleteFaculty(faculty.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 bg-transparent border-2 border-red-600 py-1 px-2 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden md:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <XCircle className="w-16 h-16 text-gray-500 mb-4" />
          <p className="text-xl text-gray-700">No Faculties Found</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Faculty</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="firstName"
                value={newFaculty.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="lastName"
                value={newFaculty.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              value={newFaculty.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded-lg"
              required
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="password"
                name="password"
                value={newFaculty.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={newFaculty.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFaculty}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                {buttonName}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyList;