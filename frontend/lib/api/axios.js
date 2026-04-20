// api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (
    typeof FormData !== "undefined" &&
    config?.data instanceof FormData &&
    config.headers
  ) {
    delete config.headers["Content-Type"];
  }
  return config;
});

const handleApiError = (error) => {
  if (!error.response) {
    return Promise.reject({
      message: "Network error. Please check your internet connection.",
      status: null,
    });
  }

  const { status, data } = error.response;

  return Promise.reject({
    status,
    message: data?.message || "Something went wrong",
    errors: data?.errors,
  });
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);