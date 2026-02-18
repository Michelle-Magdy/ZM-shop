import { apiClient } from "./axios";

export const getProductReviews = async (productId) => {
    try {
        const res = await apiClient.get(`/reviews/${productId}`);
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const handleHelpfulReview = async (reviewId) => {
    try{
        const res = await apiClient.patch(`/reviews/${reviewId}/helpful`, {}, { withCredentials: true });
        return res.data;
    }catch(err) {
        console.log(err);
        throw err;
    }
}

export const addReview = async (productId, data) => {
    try{
        const res = await apiClient.post(`/reviews/${productId}`, data, { withCredentials: true });
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}