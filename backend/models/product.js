// backend/models/product.js

/**
 * 📦 PRODUCT MODEL - Database schema for products
 *
 * This model defines how products are stored in MongoDB
 *
 * 📦 FIELDS:
 *    - name: Product name
 *    - description: Product description
 *    - price: Product price
 *    - ratings: Average rating
 *    - images: Array of product images
 *    - category: Product category
 *    - Stock: Available quantity
 *    - numOfReviews: Number of reviews
 *    - reviews: Array of user reviews
 *    - user: Who created the product
 *
 * 🔄 RELATIONSHIPS:
 *    - user: References User model (creator)
 *    - reviews.user: References User model (reviewer)
 *
 * ✅ FIXES MADE:
 *    1. Changed stock → Stock (capital S)
 *    2. Added user reference (required)
 *    3. Added reviews.user reference (required)
 *    4. Removed seller field (not in tutorial)
 *    5. Removed category enum (tutorial uses simple string)
 *    6. Added createdAt field
 *    7. Added user to reviews (required)
 *    8. Added name to reviews
 */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter product category"],
    },
    Stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    // OLD CODE — BUGGY: this schema was commented out while controllers still read product.reviews.
    // reviews: [ ... ],

    // NEW CODE — FIX: define the review documents used by review creation, population, and deletion.
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],

    // 👤 Product Creator
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true, // ✅ Enabled (was commented)
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
