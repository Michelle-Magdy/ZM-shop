import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";
export const getAllProducts = async () => {
  try {
    const res = await apiClient.get("/product");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
