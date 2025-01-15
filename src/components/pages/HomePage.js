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
  const [isApplying,setApplying]=useState("Apply Now");

  const axiosConfig = {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  // Fetch all projects data
  const getProjectsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/getallProjects`,
        axiosConfig
      );

      if (response.status === 200) {
        setUserData(response.data.allProject);
      } else {
        toast.error("Failed to fetch projects.");
      }
    } catch (error) {
      toast.error("Error fetching projects. Redirecting to login.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete all projects (admin only)
  const handleDeleteAllProjects = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all projects?");
    if (!confirmDelete) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/deleteAllProjects`,
        {},
        axiosConfig
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
    try {
      setApplying("Applying");
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/apply/${projectId}/${instructorId}`,
        {},
        axiosConfig
      );
      toast.success(response.data.message || "Successfully applied for the project.");
      getProjectsData(); // Refresh the project list to update the applied status
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for the project.");
    }

    setApplying("Apply Now");
  };

  // Handle project details modal
  const handleShowDetails = (project) => {
    setSelectedProject(project);
  };

  // Close project details modal
  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Fetch projects when component mounts
  useEffect(() => {
    getProjectsData();
  }, []);

  return (
    <>
      <ToastContainer position="bottom-left" autoClose={3000} className="z-50" />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 text-center  w-full">
                Available <span className="text-indigo-700">Projects</span>
              </h1>

              {state?.userType === "Admin" && (
                <div className="w-full sm:w-auto text-center sm:text-right">
                  <button
                    onClick={handleDeleteAllProjects}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300 ease-in-out w-full sm:w-auto"
                  >
                    Delete All Projects
                  </button>
                </div>
              )}
            </div>

            {/* Table or Cards */}
            {Array.isArray(userData) && userData.length > 0 ? (
              <>
                {/* Table View */}
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
  <div className="inline-block min-w-full align-middle">
    <table className="min-w-full divide-y divide-gray-200">
      {/* Table Header */}
      <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500">
        <tr>
          <th scope="col" className="sticky top-0 px-4 py-3.5 text-left text-sm font-semibold text-white">
            Project Name
          </th>
          <th scope="col" className="sticky top-0 px-4 py-3.5 text-left text-sm font-semibold text-white">
            Faculty Name
          </th>
          <th scope="col" className="sticky top-0 px-4 py-3.5 text-left text-sm font-semibold text-white hidden sm:table-cell">
            Prerequisites
          </th>
          <th scope="col" className="sticky top-0 px-4 py-3.5 text-left text-sm font-semibold text-white hidden md:table-cell">
            Mode
          </th>
          <th scope="col" className="sticky top-0 px-4 py-3.5 text-left text-sm font-semibold text-white hidden lg:table-cell">
            Preferred Branch
          </th>
          <th scope="col" className="sticky top-0 px-4 py-3.5 text-center text-sm font-semibold text-white">
            Details
          </th>
          {state?.userType === "Student" && (
            <th scope="col" className="sticky top-0 px-4 py-3.5 text-center text-sm font-semibold text-white">
              Action
            </th>
          )}
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="divide-y divide-gray-200 bg-white">
        {userData.map((project, idx) => (
          <tr 
            key={project.id} 
            className={`${
              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } hover:bg-indigo-50 transition-colors duration-200`}
          >
            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
              {project.projectName}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
              {project.instructorId?.firstName} {project.instructorId?.lastName}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 hidden sm:table-cell">
              {project.prerequisites}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 hidden md:table-cell">
              {project.mode}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 hidden lg:table-cell">
              {project.preferredBranch}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-sm text-center">
              <button
                onClick={() => handleShowDetails(project)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Show Details
              </button>
            </td>
            {state?.userType === "Student" && (
              <td className="whitespace-nowrap px-4 py-4 text-sm text-center">
                {project.isApplied ? (
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Already Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleBookingClick(project.id, project.projectName, project.instructorId?.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isApplying}
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
              </>
            ) : (
              <div className="flex justify-center mt-10">
                <h2 className="text-2xl font-bold text-gray-700">No Projects Found</h2>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{selectedProject.projectName}</h2>
            <div className="space-y-2">
              <p className="text-base text-gray-700">
                <strong>Instructor:</strong> {selectedProject.instructorId?.firstName} {selectedProject.instructorId?.lastName}
              </p>
              <p className="text-base text-gray-700">
                <strong>Prerequisites:</strong> {selectedProject.prerequisites}
              </p>
              <p className="text-base text-gray-700">
                <strong>Mode:</strong> {selectedProject.mode}
              </p>
              <p className="text-base text-gray-700">
                <strong>Preferred Branch:</strong> {selectedProject.preferredBranch}
              </p>
              <p className="text-base text-gray-700 mb-4">
                <strong>Description:</strong> {selectedProject.projectDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {state?.userType === "Student" && !selectedProject.isApplied && (
                <button
                  onClick={() =>
                    handleBookingClick(selectedProject.id, selectedProject.projectName, selectedProject.instructor?.id)
                  }
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isApplying}
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;