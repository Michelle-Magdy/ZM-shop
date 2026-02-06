import { apiClient } from "./axios";
export const getAllProducts = async () => {
  try {
    const res = await apiClient.get("/product");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
