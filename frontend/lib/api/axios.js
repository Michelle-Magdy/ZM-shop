// api/client.js
import axios from "axios";

const globalForAxios = globalThis;

const isDevelopment = process.env.NODE_ENV === "development";

const baseURL = isDevelopment
  ? `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/v1`
  : `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export const apiClient =
  globalForAxios.apiClient ??
  axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

if (!globalForAxios.apiClient) {
  globalForAxios.apiClient = apiClient;

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
    (error) => handleApiError(error),
  );
}
