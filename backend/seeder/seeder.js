import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/product.js";
import products from "./data.js";

// ✅ Fix the path for the env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const seedProducts = async () => {
  try {
    const dbUrl = process.env.MONGO_URI || process.env.LOCALDB_URL;
    if (!dbUrl) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");
    await Product.deleteMany();
    console.log("✅ Products deleted");
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
    process.exit(1);
  }
};
seedProducts();
