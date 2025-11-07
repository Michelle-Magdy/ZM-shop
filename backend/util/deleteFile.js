// Add to the top of product.controller.js
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs"; // Import the File System module
// ... (rest of your existing imports)

// Helper function to get directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base path for product images
const PRODUCT_IMAGES_BASE_PATH = path.join(__dirname, "..", "public", "images");

// New utility function to delete a single file
export const deleteFile = (baseFolder, filename) => {
  const filePath = path.join(PRODUCT_IMAGES_BASE_PATH, baseFolder, filename);
  // Check if the file exists before attempting to delete
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log(`${filename} deleted successfully.`);
    });
  } else {
    console.log(`File not found: ${filename}`);
  }
};
