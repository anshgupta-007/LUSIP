import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteForever } from "react-icons/md";
import LoadingSpinner from "../LoadingSpinner";

const AppliedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/userSpecificProject`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("Printing data d", response.data.appliedDetails);
      setProjects(response.data.appliedDetails || []);
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error("Failed to fetch applied projects.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (projectId) => {
    try {
      
      const isConfirmed = window.confirm("Are you sure you want to cancel this application?");
      if (!isConfirmed) return;
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/cancelApplication`, { applyId: projectId }, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Request cancelled successfully!");
        setProjects((prevProjects) => prevProjects.filter(project => project.id !== projectId));
      } else {
        toast.error("Failed to cancel the request.");
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("An error occurred while cancelling the request.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* <ToastContainer position="bottom-left" autoClose={3000} limit={1} /> */}
      <h1 className="text-4xl text-center font-extrabold mb-10 text-indigo-700">
        Applied Projects
      </h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out relative">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{project.projectId.projectName}</h2>
              </div>
              
              {project.status === 'Pending' && (
                <button
                  onClick={() => handleCancelRequest(project.id)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                >
                  <MdDeleteForever className="text-2xl" />
                </button>
              )}
              
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Instructor:</span> {project.projectId.instructorId?.firstName} {project.projectId.instructorId?.lastName}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Mode:</span> {project.projectId.mode}
              </p>
              <p className={`text-lg font-semibold ${project.status === 'Approved' ? 'text-green-600' : project.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                <span className="font-semibold">Status:</span> {project.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-700">No Projects Found</p>
      )}
    </div>
  );
};

export default AppliedProjects;
