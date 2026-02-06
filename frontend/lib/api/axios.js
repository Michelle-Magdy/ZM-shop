// api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    // If you forget this return, apiClient.get() returns undefined
    return response;
  },
  (error) => {
    // If you forget to reject, React Query might not see it as an error
    return Promise.reject(error);
  },
);
