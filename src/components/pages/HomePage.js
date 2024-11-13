import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast, ToastContainer } from "react-toastify"; 
import { UserContext } from "../../App";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const { state } = useContext(UserContext); 

  // Fetch all projects data
  const getProjectsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getallProjects`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setUserData(response.data.allProject);
      setIsLoading(false);

      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
      navigate("/login");
    }
  };

  // Delete all projects (admin only)
  const handleDeleteAllProjects = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all projects?");
    if (!confirmDelete) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/deleteAllProjects`,
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("All projects have been deleted.");
        getProjectsData(); // Refresh the project list after deletion
      }
    } catch (error) {
      toast.error("Failed to delete projects.");
    }
  };

  // Handle student project booking
  const handleBookingClick = async (projectId, projectName, instructorId) => {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/apply/${projectId}/${instructorId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    toast.success(response.data.message);
    getProjectsData(); // Refresh the project list to update the applied status
  };

  // Handle project details modal
  const handleShowDetails = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  useEffect(() => {
    getProjectsData();
  }, []);

  return (
    <>
      <ToastContainer position="bottom-left" autoClose={3000} />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 min-h-screen container mx-auto">
          <div className="flex justify-between items-center mb-8">
            {/* Centered Heading */}
            <h1 className="text-4xl font-extrabold text-gray-800 mx-auto">
              Available <span className="text-indigo-700">Projects</span>
            </h1>

            {/* Admin Button at Right End */}
            {state.userType === "Admin" && (
              <div className="flex justify-end">
                <button
                  onClick={handleDeleteAllProjects}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 hover:shadow-xl transform transition-all duration-300 ease-in-out"
                >
                  Delete All Projects
                </button>
              </div>
            )}
          </div>

          {Array.isArray(userData) && userData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-lg">
                <thead>
                  <tr className="bg-indigo-200 text-indigo-800">
                    <th className="py-4 px-6 text-center font-semibold">Project Name</th>
                    <th className="py-4 px-6 text-center font-semibold">Faculty Name</th>
                    <th className="py-4 px-6 text-center font-semibold">Prerequisites</th>
                    <th className="py-4 px-6 text-center font-semibold">Mode</th>
                    <th className="py-4 px-6 text-center font-semibold">Preferred Branch</th>
                    <th className="py-4 px-6 text-center font-semibold">Details</th>
                    {state.userType === "Student" && (
                      <th className="py-4 px-6 text-center font-semibold">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {userData.map((Project) => (
                    <tr key={Project._id} className="hover:bg-gray-100">
                      <td className="py-4 px-6 border-b text-gray-700">{Project.projectName}</td>
                      <td className="py-4 px-6 border-b text-gray-700">
                        {Project.instructor?.firstName} {Project.instructor?.lastName}
                      </td>
                      <td className="py-4 px-6 border-b text-gray-700">{Project.prerequisites}</td>
                      <td className="py-4 px-6 border-b text-gray-700">{Project.mode}</td>
                      <td className="py-4 px-6 border-b text-gray-700">{Project.preferredBranch}</td>
                      <td className="py-4 px-6 border-b text-center">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleShowDetails(Project)}
                        >
                          Show Details
                        </button>
                      </td>
                      {state.userType === "Student" && (
                        <td className="py-4 px-6 border-b text-center">
                          {Project.isApplied ? (
                            <span className="text-green-600 font-bold">Already Applied</span>
                          ) : (
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              onClick={() =>
                                handleBookingClick(
                                  Project._id,
                                  Project.projectName,
                                  Project.instructor?._id
                                )
                              }
                            >
                              Apply Now
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center mt-10">
              <h2 className="text-2xl font-bold text-gray-700">No Projects Found</h2>
            </div>
          )}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedProject.projectName}</h2>
            <p className="text-lg text-gray-700 mb-2"><strong>Instructor:</strong> {selectedProject.instructor?.firstName} {selectedProject.instructor?.lastName}</p>
            <p className="text-lg text-gray-700 mb-2"><strong>Prerequisites:</strong> {selectedProject.prerequisites}</p>
            <p className="text-lg text-gray-700 mb-2"><strong>Mode:</strong> {selectedProject.mode}</p>
            <p className="text-lg text-gray-700 mb-2"><strong>Preferred Branch:</strong> {selectedProject.preferredBranch}</p>
            <p className="text-lg text-gray-700 mb-4"><strong>Description:</strong> {selectedProject.projectDescription}</p>

            {state.userType === "Student" && !selectedProject.isApplied && (
              <button
                onClick={() => handleBookingClick(
                  selectedProject._id,
                  selectedProject.projectName,
                  selectedProject.instructor?._id
                )}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                Apply Now
              </button>
            )}

            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
