// backend/utils/cloudinary.js

/**
 * ☁️ CLOUDINARY - Image upload and management
 *
 * This file handles:
 * 1. Upload images to Cloudinary
 * 2. Delete images from Cloudinary
 *
 * 📝 HOW IT WORKS:
 *    - upload_file: Uploads image and returns { public_id, url }
 *    - delete_file: Deletes image by public_id
 *
 * 🔄 USAGE:
 *    const result = await upload_file(imageData, "products");
 *    const deleted = await delete_file(public_id);
 *
 * ✅ GREAT ADDITION: This is essential for image management!
 *    Tutorial uses cloudinary directly in controllers
 *    Your approach is cleaner (separate utility file)
 */

import cloudinary from "cloudinary";
import dotenv from "dotenv";

// ⚙️ Configure Cloudinary
dotenv.config({ path: "backend/config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 📤 Upload file to Cloudinary
 *
 * @param {string} file - Base64 image string
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Object} { public_id, url }
 */
export const upload_file = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: "auto", // Automatically detect file type
        folder: folder, // Organize in folders
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          public_id: result.public_id,
          url: result.secure_url, // HTTPS URL
        });
      },
    );
  });
};

/**
 * 🗑️ Delete file from Cloudinary
 *
 * @param {string} file - Public ID of the file to delete
 * @returns {boolean} - True if deleted successfully
 */
export const delete_file = async (file) => {
  if (!file) return false;

  try {
    const res = await cloudinary.uploader.destroy(file);
    return res?.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};
