import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "backend/config/config.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          public_id: result.public_id,
          // url: result.url,
          // used secure url form https
          url: result.secure_url,
        });
      },
    );
  });
};

export const delete_file = async (file) => {
  const res = await cloudinary.uploader.destroy(file);
  if (res?.result === "ok") {
    return true;
  }
  return false;
};
