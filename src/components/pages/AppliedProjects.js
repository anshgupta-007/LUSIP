import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppliedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/userSpecificProject`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("Printing data d",response.data.AppliedDetails);
      setProjects(response.data.AppliedDetails || []);
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error("Failed to fetch applied projects."); // Toast on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ToastContainer position="bottom-left" autoClose={3000} limit={1} />
      <h1 className="text-4xl text-center font-extrabold mb-10 text-indigo-700">
        Applied Projects
      </h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="loader bg-indigo-500 text-white p-3 rounded-full flex space-x-3 animate-pulse">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.project.projectName}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Instructor:</span> {project.project.instructor?.firstName} {project.project.instructor?.lastName}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Mode:</span> {project.project.mode}
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