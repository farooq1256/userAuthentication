import axios from "axios";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

// Global API Call Function
export const GlobalApiCall = async (
    url,
    method,
    data = {},
    successCallback,
    errorCallback,
    contentType = "application/json",
    withCredentials = false
  ) => {
    try {
      // Retrieve the token from localStorage
      const accessToken = localStorage.getItem("authToken") || "";
  
      const headers = {
        "Content-Type": contentType,
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      };
  
      let axiosConfig = {
        method,
        url,
        headers,
        withCredentials, // Include credentials if needed
      };
  
      // Only attach data if it's not empty
      if (Object.keys(data).length) {
        axiosConfig.data = data;
      }
  
      const response = await axios(axiosConfig);
      if (successCallback) {
        successCallback(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
  
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
  
          // Handle specific error cases
          if (status === 419) {
            toast.error("Your session has expired. Please log in again.");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userInfo");
            // Redirect to login page if needed
            window.location.href = "/";
          } else if (status >= 500) {
            toast.error("Something went wrong on the server.");
          } else {
            toast.error(error.response.data?.message || "Request failed.");
          }
        } else if (error.request) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
  
      if (errorCallback) {
        errorCallback(error);
      }
      throw error;
    }
  };
