import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const [newFaculty, setNewFaculty] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword:""
  });

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
          //toast.info("No faculty found");
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
        toast.error("Failed to fetch faculty data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setAuthStatus("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFaculty = async (e) => {
    setAuthStatus("");
    e.preventDefault();
    if(!newFaculty.email){
      setAuthStatus("Enter Email");
        setIsLoading(false);
        return;
    }

    // Check if password and confirm password match
    if (newFaculty.password !== newFaculty.confirmPassword) {
      setAuthStatus("Password don't Match");
      return; // Exit the function if passwords don't match
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/userpresent`, { email: newFaculty.email }, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.data.success) {
        // User is present
        setAuthStatus("User Already Present");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error checking user:", err);
      toast.error("An error occurred while checking the user. Please try again.");
    }
  
    // After user is verified, proceed with creating the faculty
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/createFacultybyAdmin`, newFaculty, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setFaculties((prev) => [...prev, response.data.faculty]);
      toast.success("Faculty added successfully!");
      setNewFaculty({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      closeModal();
    } catch (error) {
      console.error("Error adding new faculty:", error);
      toast.error("Failed to add faculty.");
    }
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
        setFaculties(faculties.filter((faculty) => faculty._id !== facultyId)); // Update UI after deletion
      } catch (error) {
        console.error("Error deleting faculty:", error.message);
        toast.error("Failed to delete faculty.");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover /> */}

      <h1 className="text-4xl text-center font-extrabold mb-10 text-indigo-700">Faculties</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={openModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Faculty
        </button>
      </div>

      {faculties.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">First Name</th>
                <th className="py-3 px-6 text-left">Last Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Account Type</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">{faculty.firstName}</td>
                  <td className="py-3 px-6">{faculty.lastName}</td>
                  <td className="py-3 px-6">{faculty.email}</td>
                  <td className="py-3 px-6">{faculty.accountType}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDeleteFaculty(faculty._id)}
                      className="text-red-600 hover:text-red-800 bg-transparent border-2 border-red-600 py-1 px-3 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-xl text-gray-700">No Faculties Found</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Faculty</h2>
            
            <input
              type="text"
              name="firstName"
              value={newFaculty.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <input
              type="text"
              name="lastName"
              value={newFaculty.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={newFaculty.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <input
              type="password"
              name="password"
              value={newFaculty.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-2 mb-6 border rounded-lg"
            />
            <input
              type="password"
              name="confirmPassword"
              value={newFaculty.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full p-2 mb-6 border rounded-lg"
            />
            {authStatus && (
                <div className="text-red-600 text-sm font-semibold mb-4">
                  {authStatus}
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
                Add Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyList;
