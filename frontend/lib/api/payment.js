import { API_BASE_URL } from "../apiConfig.js"
import { apiClient } from "./axios.js"

export const getCheckoutSession = async () => {
    const session = await apiClient.post(`${API_BASE_URL}/payment/checkout-session`, {}, {withCredentials: true});
    console.log(session);
    return session.data;
}