import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

export const getUserOrders = async () => {
  try {
    const res = await apiClient.get(`${API_BASE_URL}/orders`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getOrderStats = async () => {
  try {
    const res = await apiClient.get(`${API_BASE_URL}/orders/stats`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
