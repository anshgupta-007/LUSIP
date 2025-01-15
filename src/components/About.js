import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
// import { DepartmentList, InstitutionList } from "./Institutions";

const AboutUpdateForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    facultyType: "",
    institution: "",
    department: "",
    adminFor: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    facultyType: "",
    institution: "",
    department: "",
    adminFor: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  const callAboutPage = async () => {
    try {
      console.log("Inside About Page");
      const response = await axios.get(`http://localhost:5010/about`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.user);
      const data = response.data.user;
      console.log(data);
      setUserData(data);
      setOriginalData(data);
      setIsLoading(false);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.warn("Unauthorized Access! Please Login!", {
          toastId: "Unauthorized",
        });
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    callAboutPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex min-h-screen w-full items-center justify-center ">
          <div className="w-full rounded-xl p-12 shadow-2xl shadow-blue-200 sm:w-11/12 lg:w-7/12 bg-white">
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="col-span-1 lg:col-span-9">
                  <div className="text-center lg:text-left">
                    <div className="flex items-between justify-between">
                      <h2 className="text-2xl font-bold text-zinc-700 capitalize">
                        {userData.firstName} {userData.lastName}
                      </h2>
                    </div>
                  </div>

                  {userData.department !== "null" && (
                    <div className="mt-6 grid grid-cols-3 gap-8 text-center items-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Role</p>
                      </div>
                      <div>
                        <p className="text-m font-semibold text-zinc-700">
                          {userData.accountType}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-3 gap-8 text-center items-center lg:text-left">
                    <div>
                      <p className="font-bold text-zinc-700">Email</p>
                    </div>
                    <div>
                      <p className="text-m font-semibold text-zinc-700">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutUpdateForm;