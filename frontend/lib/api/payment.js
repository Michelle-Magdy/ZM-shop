import { API_BASE_URL } from "../apiConfig.js"
import { apiClient } from "./axios.js"

export const getCheckoutSession = async (address) => {
    const session = await apiClient.post(`${API_BASE_URL}/payment/checkout-session`, {address}, {withCredentials: true});
    console.log(session);
    return session.data;
}