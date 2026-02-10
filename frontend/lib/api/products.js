import { apiClient } from "./axios";
export const getAllProducts = async () => {
  try {
    const res = await apiClient.get("/product");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getBestSellerProducts = async () => {
  try {
    const res = await apiClient.get("/product/bestsellers");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getFeaturedProducts = async () => {
  try {
    const res = await apiClient.get("/product/featured");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTopDiscountedProducts = async() => {
  try{
    const res = await apiClient.get("/product/topDiscounts");
    return res.data;
  }catch(err){
    console.log(err);
    throw err;
  }
}

export const searchProducts = async (query) => {
  try {
    const res = await apiClient.get(`/product?search=${query}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductsByCategory = async (
  categorySlug,
  page = 1,
  limit = 2,
) => {
  try {
    const res = await apiClient.get(
      `/product/category/${categorySlug}?page=${page}&limit=${limit}`,
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getProduct = async (productSlug) => {
  try{
    const res = await apiClient.get(`/product/${productSlug}`);
    return res.data;
  }catch(err){
    console.log(err);
    throw err;
  }
}