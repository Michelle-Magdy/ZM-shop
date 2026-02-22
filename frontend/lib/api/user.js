import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

export const updateMe = async (user) => {
  try {
    const { name, phone, gender } = user;
    const res = await apiClient.patch(`${API_BASE_URL}/users/me`, {
      name,
      phone,
      gender,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
