import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 📤 Upload file to Cloudinary
 * @param {string} file - Base64 image string
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Object} { public_id, url }
 */

export const upload_file = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      },
    );
  });
};

/**
 * 🗑️ Delete file from Cloudinary
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
