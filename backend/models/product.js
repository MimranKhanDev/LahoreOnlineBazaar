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
      maxLength: [99999999, "Price cannot exceed 8 digits"],
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
      maxLength: [9999, "Stock cannot exceed 4 digits"],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
