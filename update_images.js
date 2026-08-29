import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./backend/models/product.js";

dotenv.config({ path: "backend/config/config.env" });

const run = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL_URL);
    console.log("Connected to DB");

    const products = await Product.find({});
    
    for (const product of products) {
      // Create a nice placeholder image using placehold.co
      const encodedName = encodeURIComponent(product.name.split(' ').slice(0, 3).join(' '));
      const placeholderUrl = `https://placehold.co/600x400/ef4444/ffffff?text=${encodedName}`;
      
      product.images = [
        {
          public_id: `placeholder_${product._id}`,
          url: placeholderUrl,
        }
      ];
      await product.save();
    }
    
    console.log(`Updated ${products.length} products with placeholder images.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

run();
