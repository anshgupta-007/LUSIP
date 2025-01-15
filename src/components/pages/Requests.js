import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "../LoadingSpinner";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/getallRequests`, {
          headers: { "Content-Type": "application/json" },
        });
        setRequests(response.data.faculties);
      } catch (error) {
        toast.error("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (applyId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/changeStatus`, {
        status: "Approved",
        applyId,
      });
      toast.success(response.data.message);
      setRequests(requests.map(req => req.id === applyId ? { ...req, status: "Approved" } : req));
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (applyId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/changeStatus`, {
        status: "Declined",
        applyId,
      });
      toast.success(response.data.message);
      setRequests(requests.map(req => req.id === applyId ? { ...req, status: "Declined" } : req));
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === "All") return true;
    return request.status === filter;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="bottom-right" theme="colored" />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-4 sm:mb-6">Request Management</div>
            
            <div className="flex flex-wrap justify-center  gap-8 mb-4 sm:mb-6">
              {["All", "Pending", "Approved", "Declined"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors
                    ${filter === status 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-lg sm:text-xl">No {filter.toLowerCase()==='all'? "" : filter.toLowerCase()} requests found</p>
              </div>
            ) : (
              <div className="block sm:hidden">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="mb-4 p-4 border rounded-lg">
                    <div className="mb-2">
                      <label className="text-sm text-gray-500">Project</label>
                      <div className="text-base font-medium text-gray-900">{request.projectId.projectName}</div>
                    </div>
                    <div className="mb-2">
                      <label className="text-sm text-gray-500">Student</label>
                      <div className="text-base text-gray-700">{request.studentId.firstName} {request.studentId.lastName}</div>
                    </div>
                    <div className="mb-3">
                      <label className="text-sm text-gray-500">Status</label>
                      <div>
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${request.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : request.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }
                        `}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        disabled={request.status === "Approved"}
                        className={`
                          flex-1 py-2 rounded-md text-sm font-medium
                          ${request.status === "Approved"
                            ? "bg-gray-100 text-gray-400"
                            : "bg-green-50 text-green-700 border border-green-200"
                          }
                        `}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={request.status === "Declined"}
                        className={`
                          flex-1 py-2 rounded-md text-sm font-medium
                          ${request.status === "Declined"
                            ? "bg-gray-100 text-gray-400"
                            : "bg-red-50 text-red-700 border border-red-200"
                          }
                        `}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-blue-50">
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider">Student</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-blue-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                        {request.projectId.projectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                        {request.studentId.firstName} {request.studentId.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${request.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : request.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }
                        `}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleAccept(request.id)}
                            disabled={request.status === "Approved"}
                            className={`
                              px-3 py-1.5 border text-sm font-medium rounded-md
                              ${request.status === "Approved"
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                              }
                            `}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={request.status === "Declined"}
                            className={`
                              px-3 py-1.5 border text-sm font-medium rounded-md
                              ${request.status === "Declined"
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                              }
                            `}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;