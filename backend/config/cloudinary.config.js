import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer - The image buffer to upload.
 * @param {object} options - Cloudinary upload options (folder, public_id, etc.)
 * @returns {Promise<object>} Cloudinary upload result with secure_url, public_id, etc.
 */
export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 * @param {string} publicId - The public_id of the image to delete.
 * @returns {Promise<object>} Cloudinary destroy result.
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

/**
 * Extract the public_id from a Cloudinary URL.
 * Example: https://res.cloudinary.com/demo/image/upload/v12345/zm-shop/products/product-123.jpg
 * Returns: zm-shop/products/product-123
 * @param {string} url - The full Cloudinary URL.
 * @returns {string|null} The public_id or null if not a Cloudinary URL.
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== "string") return null;

  // Only process Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return null;

  try {
    // Match everything after /upload/v<digits>/ and before the file extension
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export default cloudinary;
