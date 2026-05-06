import { apiClient } from "./axios";
import { API_BASE_URL } from "../apiConfig.js";

export const getProductReviews = async (productId, page = 1, limit = 10) => {
    const res = await apiClient.get(`${API_BASE_URL}/reviews/product/${productId}?page=${page}&limit=${limit}`);
    return res.data;

}

export const handleHelpfulReview = async (reviewId) => {
    try {
        const res = await apiClient.patch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {}, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const addReview = async (productId, data) => {
    const res = await apiClient.post(`${API_BASE_URL}/reviews/product/${productId}`, data);
    return res.data;

}

export const editReview = async (reviewId, data) => {
    try {
        const res = await apiClient.patch(`${API_BASE_URL}/reviews/${reviewId}`, data, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const deleteReview = async (reviewId) => {
    try {
        const res = await apiClient.delete(`${API_BASE_URL}/reviews/${reviewId}`, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const reportReview = async (reviewId, reason) => {
    const res = await apiClient.patch(`reviews/${reviewId}/report`, { reason });
    return res.data;
}