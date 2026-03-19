import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Shared Axios client for calling the backend API.
 * NOTE: NEXT_PUBLIC_* variables are safe to reference from the browser.
 */
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;

