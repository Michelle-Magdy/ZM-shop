import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";
import serverApiClient from "./serverApi.js";

const USERS_LIMIT = 5;

export const updateMe = async (user) => {
  try {
    const { name, phone, gender } = user;
    const res = await apiClient.patch(
      `${API_BASE_URL}/users/me`,
      {
        name,
        phone,
        gender,
      },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUsersStats = async () => {
  // used in server component
  const apiServer = await serverApiClient();
  const response = await apiServer.get(`users/stats`);
  return response.data;
}

export const getUsers = async (page, search, role, status) => {
  let url = `users?page=${page}&limit=${USERS_LIMIT}`;

  if (search)
    url += `&search=${encodeURIComponent(search)}`;

  if (role)
    url += `&role=${encodeURIComponent(role)}`;

  if(status === "suspended"){
    url += `&isSuspended=true`;
  }
  if(status === "deleted"){
    url += `&isDeleted=true`;
  }
  if(status === "active"){
    url += `&isSuspended=false&isDeleted=false`;
  }

  const response = await apiClient.get(url);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await apiClient.patch(`users/${id}`, data);
  return response.data;
}

export const addUser = async (data) => {
  const response = await apiClient.post("users", data);
  return response.data;
}