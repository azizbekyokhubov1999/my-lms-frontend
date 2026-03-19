import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? "GET").toUpperCase();
    // Keep logs small; response data can be large.
    console.log("[api] request", method, config.url);
    return config;
  },
  (error) => {
    console.error("[api] request error", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    console.error("[api] response error", status, error.message, error.response?.data);
    return Promise.reject(error);
  },
);

export default api;

