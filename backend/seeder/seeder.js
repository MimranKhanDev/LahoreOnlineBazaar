// backend/seeder/seeder.js

/**
 * 🌱 SEEDER - Database seeder script
 *
 * This script:
 * 1. Connects to MongoDB
 * 2. Deletes all existing products
 * 3. Inserts sample products
 *
 * 🚀 HOW TO RUN:
 *    node backend/seeder/seeder.js
 * ⚠️ WARNING: This DELETES all existing products!
 *    Use only for development/testing
 *
 * 📝 USAGE:
 *    1. Make sure your .env has DB_LOCAL_URL
 *    2. Run: node backend/seeder/seeder.js
 *    3. Check console for success message
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

// Import models
import Product from "../models/product.js";
import products from "./data.js";

/**
 * 🚀 Seed products into database
 */
const seedProducts = async () => {
  try {
    // 🔗 Connect to MongoDB
    const DB_LOCAL_URL = process.env.DB_LOCAL_URL;
    if (!DB_LOCAL_URL) {
      throw new Error("DB_LOCAL_URL is not defined in environment variables");
    }

    await mongoose.connect(DB_LOCAL_URL);
    console.log("✅ Connected to MongoDB");

    // 🗑️ Delete all existing products
    await Product.deleteMany();
    console.log("✅ Products deleted");

    // 📥 Insert sample products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully`);

    // 🔚 Exit process
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
    process.exit(1);
  }
};

// 🚀 Run seeder
seedProducts();
