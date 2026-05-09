import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

const ORDERS_LIMIT = 5;

export const getUserOrders = async (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.status) searchParams.set("orderStatus", params.status);
  searchParams.set("limit", ORDERS_LIMIT);
  const query = searchParams.toString();

  const res = await apiClient.get(`orders${query ? `?${query}` : ""}`);
  return res.data;
};

export const getOrderStats = async () => {
  const res = await apiClient.get(`${API_BASE_URL}/orders/stats`);
  return res.data;
};

export const getAdminOrdersStats = async () => {
  const res = await apiClient.get("orders/admin/stats");
  return res.data;
};

export const getOrders = async (page, searchTerm, status, paymentStatus) => {
  let url = `orders/admin?page=${page}&limit=${ORDERS_LIMIT}`;

  if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

  if (status) url += `&orderStatus=${encodeURIComponent(status)}`;

  if (paymentStatus)
    url += `&paymentStatus=${encodeURIComponent(paymentStatus)}`;

  const res = await apiClient.get(url);
  return res.data;
};

export const updateOrder = async (orderId, data) => {
  const res = await apiClient.patch(`orders/admin/${orderId}`, data);
  return res.data;
};
