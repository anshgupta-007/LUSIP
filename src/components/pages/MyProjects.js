import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import { MdDeleteForever } from "react-icons/md";
import LoadingSpinner from "../LoadingSpinner";
import ContactSection from "../ContactSection";

const TeacherProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
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
      console.log(response.data);

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
      //console.log("Project")
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/updateProject/${projectDetails.id}`,
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

  const handleViewApplicants = async (projectId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/getApplicants/${projectId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      const applicantsData = response.data.applicants || [];
      if (applicantsData.length >= 0) {
        setApplicants(applicantsData);
        setIsApplicantsModalOpen(true);
      } else {
        toast.info("No applicants found for this project.");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to fetch applicants.");
    }
  };
  
  const closeApplicantsModal = () => {
    setIsApplicantsModalOpen(false);
    setApplicants([]);
  };
  
  if (isLoading) {
    return  <LoadingSpinner/>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* <ToastContainer position="bottom-left" autoClose={3000} limit={1} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover /> */}

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

      {false ? (
        <LoadingSpinner/>
      ) : projects.length > 0 ? (
        <div className="overflow-x-auto">
  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
    <thead className="bg-indigo-200 text-indigo-800">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold">Project Name</th>
        <th className="px-6 py-4 text-left text-sm font-semibold">Mode</th>
        <th className="px-6 py-4 text-left text-sm font-semibold">Prerequisites</th>
        <th className="px-6 py-4 text-left text-sm font-semibold">Preferred Branch</th>
        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody>
      {projects.map((project, index) => (
        <tr
          key={project.id}
          className={clsx("hover:bg-gray-100 transition", {
            "bg-gray-50": index % 2 === 0,
            "bg-white": index % 2 !== 0,
          })}
        >
          <td className="px-6 py-4 text-gray-800">{project.projectName}</td>
          <td className="px-6 py-4 text-gray-600">{project.mode}</td>
          <td className="px-6 py-4 text-gray-600">{project.prerequisites}</td>
          <td className="px-6 py-4 text-gray-600">{project.preferredBranch}</td>
          <td className="px-6 py-4 flex justify-center gap-4">
            {/* View Details Button */}
            <button
              onClick={() => handleViewDetails(project)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow hover:bg-indigo-700 transition"
            >
              View Details
            </button>

            {/* View Applicants Button */}
            <button
              onClick={() => handleViewApplicants(project.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm shadow hover:bg-green-700 transition"
            >
              View Applicants
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteProject(project.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm shadow hover:bg-red-700 transition"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {isApplicantsModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Applicants for the Project
      </h2>

      {applicants.length > 0 ? (
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Student Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, index) => (
                <tr
                  key={index}
                  className={clsx("hover:bg-gray-100 transition", {
                    "bg-gray-50": index % 2 === 0,
                    "bg-white": index % 2 !== 0,
                  })}
                >
                  <td className="px-4 py-3 text-gray-800">
                    {applicant.student.firstName}{" "}{applicant.student.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {applicant.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700 text-center">No applicants found.</p>
      )}

      <div className="mt-4 text-right">
        <button
          onClick={closeApplicantsModal}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

</div>

      ) : (
        <p className="text-center text-xl text-gray-700">No Projects Found</p>
      )}

      {/* Add Project Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Project</h2>

      {/* Project Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Project Name</label>
        <input
          type="text"
          name="projectName"
          placeholder="Enter project name"
          className="w-full px-3 py-2 border rounded"
          value={newProject.projectName}
          onChange={handleInputChange}
        />
      </div>

      {/* Mode */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Mode</label>
        <select
          name="mode"
          className="w-full px-3 py-2 border rounded"
          value={newProject.mode}
          onChange={handleInputChange}
        >
          <option value="">Select mode</option>
          <option value="Both">Both</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      {/* Prerequisites */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Prerequisites</label>
        <input
          type="text"
          name="prerequisites"
          placeholder="Enter prerequisites"
          className="w-full px-3 py-2 border rounded"
          value={newProject.prerequisites}
          onChange={handleInputChange}
        />
      </div>

      {/* Preferred Branch */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Preferred Branch</label>
        <select
          name="preferredBranch"
          className="w-full px-3 py-2 border rounded"
          value={newProject.preferredBranch}
          onChange={handleInputChange}
        >
          <option value="">Select preferred branch</option>
          <option value="ALL">ALL</option>
          <option value="CSE">CSE</option>
          <option value="CCE">CCE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Enter project description"
          className="w-full px-3 py-2 border rounded"
          rows="3"
          value={newProject.description}
          onChange={handleInputChange}
        />
      </div>

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
