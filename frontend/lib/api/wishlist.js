import { API_BASE_URL } from "../apiConfig"
import { apiClient } from "./axios"

export const getWishlist = async () => {
    try {
        const wishlist = await apiClient.get(`${API_BASE_URL}/wishlist`, { withCredentials: true });
        return wishlist.data
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const updateWishlist = async (data) => {
    try{
        const wishlist = await apiClient.put(`${API_BASE_URL}/wishlist`, data, { withCredentials: true });
        return wishlist.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}