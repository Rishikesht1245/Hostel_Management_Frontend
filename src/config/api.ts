import axios from "axios";

//student api (we can use like studentAPI.get())
export const studentAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/students`,
});

//Chief warden api
export const chiefWardenAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/chief-warden`,
});

//Staff api
export const staffAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/staffs`,
});

// Check Authorization API
export const checkAuth = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/checkAuth`,
});
