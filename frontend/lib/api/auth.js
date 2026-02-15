import { API_BASE_URL } from "../apiConfig"
import { apiClient } from "./axios"

export const login = async (data) => {
    try{
        const res = await apiClient.post(`${API_BASE_URL}/auth/login`, data, { withCredentials: true });
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const getMe = async () => {
    try{
        const res = await apiClient.get(`${API_BASE_URL}/auth/me`, { withCredentials: true });
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const logout = async () => {
    try{
        const res = await apiClient.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}