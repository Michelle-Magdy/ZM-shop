import { apiClient } from "./axios.js"

export const applyCoupon = async (code) => {
    const response = await apiClient.get(`coupons/exist/${code}`);
    return response.data;
}