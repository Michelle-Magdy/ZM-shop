import { IMAGES_BASE_URL } from "../apiConfig.js";

export const getProductImageSrc = (img) =>
  img
    ? img.startsWith("http")
      ? img
      : `${IMAGES_BASE_URL}/products/${img}`
    : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg";

export const getCategoryImageSrc = (img) => {
  console.log(img);
  return img
    ? img.startsWith("http")
      ? img
      : `${IMAGES_BASE_URL}/categories/${img}`
    : "https://cdn-icons-png.flaticon.com/512/1261/1261163.png";
};

export default getProductImageSrc;
