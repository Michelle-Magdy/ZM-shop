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

export const getProductsByCategory = async (categorySlug) => {
  try{
  const res = await apiClient.get(`/category/${categorySlug}`);
  return res.data;
  }
  catch(err){
    console.log(err)
    throw err;
  }
}