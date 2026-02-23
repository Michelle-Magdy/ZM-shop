import { apiClient } from "./axios";
import { API_BASE_URL } from "../apiConfig";

export const getUserCart = async () => {
    try{
        const res = await apiClient.get(`${API_BASE_URL}/cart`, { withCredentials: true });
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const updateCart = async (items) => {
    try{
        const res = await apiClient.put(`${API_BASE_URL}/cart`, { items }, { withCredentials: true });
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}