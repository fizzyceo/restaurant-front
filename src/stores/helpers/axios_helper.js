/* eslint-disable no-debugger */
import axios from "axios";
import { tokenHelper } from "./token_helper";
import { toast } from "react-toastify";

const baseURL = "http://localhost:8000"; //https://qa.teaboy.io/api/ https://basseer-internship-backend-davh.onrender.com/
//'http://localhost:8000'
// Create axios Instance
export const axiosHelper = axios.create();

// Axios Defaults
axiosHelper.defaults.baseURL = baseURL;
axiosHelper.defaults.headers.post["Content-Type"] = "application/json";

// interceptors
axiosHelper.interceptors.request.use(
  (config) => {
    if (!config.headers) return config;
    const token = tokenHelper.getToken() || null;
    config.headers.common["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // alert(error.response.data.message);
    throw error;
  }
);
axiosHelper.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    // debugger

    // console.error(error.response.data.message);
    // console.error(error.response);
    toast.error(error.response?.data?.message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    // alert(error.response.data.message);
    throw error;
    // alert("Error " + error);
    // Custom Error Dialog
    // let message;
    // switch (error.status) {
    //   case 500:
    //     message = "Internal Server Error";
    //     break;
    //   case 401:
    //     message = "Invalid credentials";
    //     break;
    //   case 404:
    //     message = "Sorry! the data you are looking for could not be found";
    //     break;
    //   default:
    //     message = error.message || error;
    // }
    // return Promise.reject(message);
  }
);
