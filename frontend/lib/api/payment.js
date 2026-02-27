import { API_BASE_URL } from "../apiConfig.js"
import { apiClient } from "./axios.js"

export const getCheckoutSession = async (address, phone) => {
    const session = await apiClient.post(`${API_BASE_URL}/payment/checkout-session`, {address, phone}, {withCredentials: true});
    return session.data;
}