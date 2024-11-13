import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import { MdDeleteForever } from "react-icons/md";

const TeacherProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: "",
    mode: "",
    status: "",
    prerequisites: "",
    preferredBranch: "",
    description: "",
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchTeacherProjects = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/getInstructorProjects`,
        {},
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const fetchedProjects = response.data.Projects || [];
      setProjects(fetchedProjects);

      if (fetchedProjects.length === 0) {
        toast.info("No Projects Listed");
      } else {
        // toast.success("Successfully fetched projects!");
      }
    } catch (error) {
      console.error("Error fetching teacher's project data:", error);
      toast.error("Failed to fetch projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeacherProjects();
  }, [fetchTeacherProjects]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/createProject`,
        {
          projectName: newProject.projectName,
          mode: newProject.mode,
          prerequisites: newProject.prerequisites,
          preferredBranch: newProject.preferredBranch,
          projectDescription: newProject.description,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setProjects((prev) => [...prev, response.data.project]);
      toast.success("Project added successfully!");
      setNewProject({
        projectName: "",
        mode: "",
        status: "",
        prerequisites: "",
        preferredBranch: "",
        description: "",
      });
      closeModal();
    } catch (error) {
      console.error("Error adding new project:", error);
      toast.error("Failed to add project.");
    }
  };

  const handleDeleteProject = (projectId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (isConfirmed) {
      deleteProject(projectId);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/deleteProject/${projectId}`,
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Successfully Deleted Project");
      fetchTeacherProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    }
  };

  const handleViewDetails = (project) => {
    setProjectDetails(project);
    setIsDetailsModalOpen(true);
    setIsEditMode(false); // Set edit mode off initially
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setProjectDetails(null);
  };

  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleProjectDetailsChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/updateProject/${projectDetails._id}`,
        {
          projectName: projectDetails.projectName,
          mode: projectDetails.mode,
          prerequisites: projectDetails.prerequisites,
          preferredBranch: projectDetails.preferredBranch,
          projectDescription: projectDetails.projectDescription,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Project updated successfully!");
      fetchTeacherProjects(); // Refresh project list after saving
      setIsEditMode(false);
      closeDetailsModal(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ToastContainer position="bottom-left" autoClose={3000} limit={1} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

      <h1 className="text-4xl text-center font-extrabold mb-10 text-indigo-700">
        My Listed Projects
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={openModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="loader bg-indigo-500 text-white p-3 rounded-full flex space-x-3 animate-pulse">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className={clsx(
                "bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out relative",
                { "bg-indigo-100": selectedProjectId === project._id }
              )}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {project.projectName}
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Mode:</span> {project.mode}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Prerequisites:</span>{" "}
                {project.prerequisites}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Preferred Branch:</span>{" "}
                {project.preferredBranch}
              </p>

              <button
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                onClick={() => handleDeleteProject(project._id)}
              >
                <MdDeleteForever className="text-2xl" />
              </button>

              <button
                onClick={() => handleViewDetails(project)}
                className="mt-4 text-indigo-600 font-semibold hover:underline"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-700">No Projects Found</p>
      )}

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Project</h2>

            {/* Other project form fields here */}

            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {isDetailsModalOpen && projectDetails && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-8 relative">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-4">
        Project Details
      </h2>

      {/* Project Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Project Name</label>
        <input
          type="text"
          name="projectName"
          value={projectDetails.projectName}
          onChange={handleProjectDetailsChange}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-indigo-500 transition"
          disabled={!isEditMode}
        />
      </div>

      {/* Mode */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Mode</label>
        <select
          name="mode"
          value={projectDetails.mode}
          onChange={handleProjectDetailsChange}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-indigo-500 transition"
          disabled={!isEditMode}
        >
          <option value="Both">Both</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      {/* Prerequisites */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Prerequisites</label>
        <input
          type="text"
          name="prerequisites"
          value={projectDetails.prerequisites}
          onChange={handleProjectDetailsChange}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-indigo-500 transition"
          disabled={!isEditMode}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Description</label>
        <textarea
          name="projectDescription"
          value={projectDetails.projectDescription}
          onChange={handleProjectDetailsChange}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-indigo-500 transition"
          rows="4"
          disabled={!isEditMode}
        />
      </div>

      {/* Preferred Branch */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium">Preferred Branch</label>
        <select
          name="preferredBranch"
          value={projectDetails.preferredBranch}
          onChange={handleProjectDetailsChange}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-indigo-500 transition"
          disabled={!isEditMode}
        >
          <option value="ALL">ALL</option>
          <option value="CSE">CSE</option>
          <option value="CCE">CCE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleEditToggle}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isEditMode ? "bg-gray-500 text-white" : "bg-yellow-500 text-white"
          } hover:opacity-90 transition`}
        >
          {isEditMode ? "Cancel Edit" : "Edit"}
        </button>

        {isEditMode && (
          <button
            onClick={handleSaveChanges}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        )}
        <button
          onClick={closeDetailsModal}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default TeacherProjects;
