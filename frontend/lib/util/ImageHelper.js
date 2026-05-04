import { IMAGES_BASE_URL } from "../apiConfig.js";

const getImageSrc = (img) =>
  img
    ? img.includes("media-amazon")
      ? img
      : `${IMAGES_BASE_URL}/products/${img}`
    : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg";

export default getImageSrc