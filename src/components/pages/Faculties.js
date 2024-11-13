import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch faculties
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
        console.log("gddryjt",response.data);
        if(response.data.faculties){
            setFaculties(response.data.faculties);
            toast.success("Faculty Fetched SuccesFully");
        }

        if(!response.data.faculties)
            toast.success("No Faculty Found");
        
      } catch (error) {
        console.error("Error fetching faculties:", error);
        toast.error("Failed to fetch faculty data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  // Delete faculty
  const handleDeleteFaculty = async (facultyId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this faculty?");
    if (isConfirmed) {
      try {
        console.log(`${process.env.REACT_APP_SERVER_URL}/deleteFaculty/${facultyId}`);
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteFaculty/${facultyId}`, {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader bg-indigo-500 text-white p-3 rounded-full flex space-x-3 animate-pulse">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
     <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

      <h1 className="text-4xl text-center font-extrabold mb-10 text-indigo-700">Faculties</h1>

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
    </div>
  );
};

export default FacultyList;
