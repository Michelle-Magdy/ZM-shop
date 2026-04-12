import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

export const getStats = async (from, to) => {
  try {
    const res = await apiClient.get(
      `${API_BASE_URL}/admin/dashboard/stats?from=${from}&to=${to}`,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getChartData = async (from, to, groupBy = "day") => {
  try {
    const res = await apiClient.get(
      `${API_BASE_URL}/admin/dashboard/chart?from=${from}&to=${to}&groupBy=${groupBy}`,
    );

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getRecentOrders = async (limit = 10) => {
  try {
    const res = await apiClient.get(
      `${API_BASE_URL}/admin/dashboard/recent-orders?limit=${limit}`,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
