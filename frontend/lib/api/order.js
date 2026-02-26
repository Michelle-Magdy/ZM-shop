import { API_BASE_URL } from "../apiConfig.js"
import { apiClient } from "./axios.js"

export const createOrder = async (address) => {
    const order = await apiClient.post(`${API_BASE_URL}/orders`, { address }, { withCredentials: true });
    return order.data;
}