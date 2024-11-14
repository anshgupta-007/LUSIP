import  { useEffect, useContext,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from './../../App'
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
  

const Logout = () => {
  const { dispatch } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

    // const userId = localStorage.getItem("userId")

    const logoutUser = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/logout/`, {
          // userId,
          withCredentials: true, // include credentials in the request
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // "userId": localStorage.getItem("userId")
          }
        });
          dispatch({ type: "USER", payload: null })
          dispatch({ type: "USER_TYPE", payload: null })

          // Clear localStorage
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
          localStorage.removeItem("jwtoken");
          // Show success message
          setIsLoading(false)
          toast.success("Logout Successfully", {
            toastId: 'logout',
        })

          // Navigate to Home page
          navigate("/", {replace: true});
      } catch (error) {
        //consolelog(error);
      }
    }
  useEffect(() => {
    logoutUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (<>
     {isLoading ? <LoadingSpinner /> : null}

  </>
  )
}

export default Logout;
