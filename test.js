import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./backend/models/product.js";
import APIFilters from "./backend/utils/apiFilters.js";

dotenv.config({ path: "backend/config/config.env" });

const run = async () => {
  await mongoose.connect(process.env.DB_LOCAL_URL);
  
  const reqQuery = { "price[gte]": "0", "price[lte]": "25000" };
  // Express parses nested objects like this:
  const parsedQuery = { price: { gte: "0", lte: "25000" } };
  
  const apiFilters = new APIFilters(Product, parsedQuery).search().filters();
  const products = await apiFilters.query;
  console.log("Found:", products.length);
  process.exit(0);
};
run();
