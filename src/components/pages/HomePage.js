import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../App";
import "react-toastify/dist/ReactToastify.css";

// Improved Loading and Error Handling Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-24 w-24 text-red-500 mb-4" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
      />
    </svg>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
    <p className="text-gray-600 mb-4">{message}</p>
    <button 
      onClick={onRetry}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
    >
      Try Again
    </button>
  </div>
);


const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const { state } = useContext(UserContext);

  const axiosConfig = {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  // Enhanced error handling for API calls
  const handleApiError = (error, defaultMessage) => {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      defaultMessage;
    
    toast.error(errorMessage);
    setError(errorMessage);
    console.error(error);
  };

  const handleShowDetails = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Fetch all projects data with improved error handling
  const getProjectsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/getallProjects`,
        axiosConfig
      );

      if (response.status === 200 && Array.isArray(response.data.allProject)) {
        setUserData(response.data.allProject);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      handleApiError(
        error, 
        "Failed to fetch projects. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete all projects with confirmation and error handling
  const handleDeleteAllProjects = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all projects? This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/deleteAllProjects`,
        {},
        axiosConfig
      );
      
      if (response.status === 200) {
        toast.success("All projects have been deleted successfully.");
        getProjectsData(); // Refresh the project list
      }
    } catch (error) {
      handleApiError(
        error, 
        "Failed to delete projects. Please try again."
      );
    }
  };

  // Project booking with comprehensive error handling
  const handleBookingClick = async (projectId, projectName, instructorId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/apply/${projectId}/${instructorId}`,
        {},
        axiosConfig
      );
      
      toast.success(
        response.data.message || 
        `Successfully applied for the project: ${projectName}`
      );
      
      getProjectsData(); // Refresh to update applied status
    } catch (error) {
      handleApiError(
        error, 
        `Failed to apply for project: ${projectName}`
      );
    }
  };

  // Lifecycle method to fetch projects
  useEffect(() => {
    getProjectsData();
  }, []);

  // Render methods
  const renderProjectTable = () => (
    <div className="w-full overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-indigo-100 text-indigo-800">
          <tr>
            {["Project Name", "Faculty", "Prerequisites", "Mode", "Branch", "Details", 
              ...(state?.userType === "Student" ? ["Action"] : [])
            ].map((header) => (
              <th 
                key={header} 
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {userData.map((project) => (
            <tr 
              key={project.id} 
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.projectName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.instructorId?.firstName} {project.instructorId?.lastName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.prerequisites}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.mode}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.preferredBranch}
              </td>
              <td className="px-4 py-3">
                <button 
                  onClick={() => handleShowDetails(project)}
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                >
                  View Details
                </button>
              </td>
              {state?.userType === "Student" && (
                <td className="px-4 py-3">
                  {project.isApplied ? (
                    <span className="text-green-600 font-bold">Applied</span>
                  ) : (
                    <button 
                      onClick={() => handleBookingClick(
                        project.id, 
                        project.projectName, 
                        project.instructorId.id
                      )}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Apply
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
      {userData.map((project) => (
        <div 
          key={project.id} 
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300"
        >
          <h3 className="text-lg font-bold mb-2 text-indigo-700">
            {project.projectName}
          </h3>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <strong>Faculty:</strong> {project.instructorId?.firstName} {project.instructorId?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Mode:</strong> {project.mode}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Branch:</strong> {project.preferredBranch}
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleShowDetails(project)}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Details
            </button>
            {state?.userType === "Student" && !project.isApplied && (
              <button 
                onClick={() => handleBookingClick(
                  project.id, 
                  project.projectName, 
                  project.instructorId.id
                )}
                className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Apply
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Render final component
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={getProjectsData} />;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              {selectedProject.projectName}
            </h2>
            <div className="space-y-2">
              {/* Comprehensive Logging for Debugging */}
              <p className="text-base text-gray-700">
                <strong>Instructor:</strong> {(() => {
                  console.log("Instructor Data:", {
                    instructorId: selectedProject.instructorId,
                    instructor: selectedProject.instructor
                  });
                  return selectedProject.instructorId?.firstName 
                    || selectedProject.instructor?.firstName 
                    || "Not Available"
                })()} {(() => {
                  return selectedProject.instructorId?.lastName 
                    || selectedProject.instructor?.lastName 
                    || ""
                })()}
              </p>
              <p className="text-base text-gray-700">
                <strong>Prerequisites:</strong> {selectedProject.prerequisites || "None specified"}
              </p>
              <p className="text-base text-gray-700">
                <strong>Mode:</strong> {selectedProject.mode || "Not specified"}
              </p>
              <p className="text-base text-gray-700">
                <strong>Preferred Branch:</strong> {selectedProject.preferredBranch || "Any"}
              </p>
              <p className="text-base text-gray-700 mb-4">
                <strong>Description:</strong> {selectedProject.projectDescription || "No description available"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {state?.userType === "Student" && !selectedProject.isApplied && (
                <button
                  onClick={() =>
                    handleBookingClick(
                      selectedProject.id, 
                      selectedProject.projectName, 
                      selectedProject.instructorId?.id || selectedProject.instructor?.id
                    )
                  }
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Now
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

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
        Available <span className="text-indigo-600">Projects</span>
      </h1>
        {state?.userType === "Admin" && (
          <button 
            onClick={handleDeleteAllProjects}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Delete All Projects
          </button>
        )}
      </div>

      {/* Projects Display */}
      {userData.length > 0 ? (
        <>
          {renderProjectTable()}
          {renderMobileView()}
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-600">
            No Projects Available
          </h2>
        </div>
      )}

      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default HomePage;