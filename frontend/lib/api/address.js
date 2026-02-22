import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

export const addAddresses = async (data) => {
  try {
    const {
      userId,
      latitude,
      longitude,
      label,
      address: add,
      isDefault,
    } = data;
    const res = await apiClient.post(`${API_BASE_URL}/addresses`, {
      userId,
      latitude,
      longitude,
      label,
      add,
      isDefault,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAddresses = async (userId) => {
  try {
    const res = await apiClient.get(`${API_BASE_URL}/addresses/${userId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
