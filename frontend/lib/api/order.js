import { apiClient } from "./axios.js"

export const createOrder = async (address, phone) => {
    const order = await apiClient.post(`orders`, { address, phone });
    return order.data;
}

export const cancelOrder = async (orderId) => {
    const order = await apiClient.post(`orders/cancel/${orderId}`);
    return order.data;
}