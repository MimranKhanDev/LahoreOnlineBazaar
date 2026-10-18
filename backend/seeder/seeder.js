import mongoose from "mongoose";
import "dotenv/config";
import Product from "../models/product.js";
import products from "./data.js";

const seedProducts = async () => {
  try {
    const dbUrl = process.env.LOCALDB_URL;
    if (!dbUrl) {
      throw new Error("LOCALDB_URL is not defined in environment variables");
    }
    await mongoose.connect(DB_LOCAL_URL);
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
