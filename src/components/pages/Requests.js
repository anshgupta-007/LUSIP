import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "../LoadingSpinner";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending"); // Default filter

  // Fetch requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/getallRequests`, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response.data.faculties);
        setRequests(response.data.faculties); // Assuming the response contains an array of requests
      } catch (error) {
        console.error("Error fetching requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle accepting a request
  const handleAccept = async (applyId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/changeStatus`, {
        status: "Approved",
        applyId,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(response.data.message);
      setRequests(requests.map(req => req.id === applyId ? { ...req, status: "Approved" } : req));
    } catch (error) {
      console.error("Error accepting request", error);
    }
  };

  // Handle rejecting a request without a reason
  const handleReject = async (applyId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/changeStatus`, {
        status: "Declined",
        applyId,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(response.data.message);
      setRequests(requests.map(req => req.id === applyId ? { ...req, status: "Declined" } : req));
    } catch (error) {
      console.error("Error rejecting request", error);
    }
  };

  // Filter requests based on the selected filter
  const filteredRequests = requests.filter((request) => {
    if (filter === "All") return true;
    return request.status === filter;
  });

  if (loading) {
    return  <LoadingSpinner/>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100"> {/* Full height with background */}
      <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="container mx-auto p-6 max-w-4xl bg-white shadow-md rounded-lg mt-6 mb-6"> {/* Content container */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Requests</h1>

        {/* Filter buttons */}
        <div className="flex gap-4 mb-6">
          {["All", "Pending", "Approved", "Declined"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                filter === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Request table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          {filteredRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-600 text-lg">
              <p>No "{filter}" requests found</p>
            </div>
          ) : (
            <table className="w-full border-collapse bg-white rounded-lg">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="p-3 border-b">Project Name</th>
                  <th className="p-3 border-b">Student Name</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b text-gray-800">{request.project.projectName}</td>
                    <td className="p-4 border-b text-gray-800">{request.studentId.firstName} {request.studentId.lastName}</td>
                    <td className="p-4 border-b">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === "Approved" ? "bg-green-100 text-green-700" :
                        request.status === "Declined" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 border-b text-center space-x-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600"
                        disabled={request.status === "Approved"}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600"
                        disabled={request.status === "Declined"}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
