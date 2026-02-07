import { apiClient } from "./axios";
export const getAllProducts = async () => {
  try {
    const res = await apiClient.get("/product");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};


export const searchProducts = async (query) => {
  try {
    const res = await apiClient.get(`/product?search=${query}`);
    return res.data;
  }catch(error) {
    console.log(error);
    throw error;
  }
}