// backend/seeder/seeder.js - SIMPLE VERSION

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/product.js";
import products from "./data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL_URL);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany();
    console.log("🗑️ Products deleted");

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedProducts();
