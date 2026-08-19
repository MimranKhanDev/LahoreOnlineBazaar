import React from "react";
import { Link } from "react-router-dom";
// import { Rating } from "@mui/lab";
import Rating from "@mui/material/Rating";
import { motion } from "framer-motion";
import { AiOutlineHeart } from "react-icons/ai"; // Wishlist icon

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings || 0,
    readOnly: true,
    precision: 0.5,
    size: "small",
  };

  // Calculate discount (example: if original price > current price)
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {/* 🎯 Image Container with Overlay */}
      <div className="relative overflow-hidden bg-gray-100">
        <motion.img
          src={product.images[0]?.url || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />

        {/* 🏷️ Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}

        {/* ❤️ Wishlist Button (Heart) */}
        <button
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            // Add to wishlist logic here
            toast.success("Added to wishlist!");
          }}
        >
          <AiOutlineHeart className="text-xl text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* 🏷️ Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-black px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Quick View
          </span>
        </div>
      </div>

      {/* 📝 Product Info */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 truncate text-lg group-hover:text-red-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <Rating {...options} />
          <span className="text-sm text-gray-500 ml-2">
            ({product.numOfReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center mt-3">
          <span className="text-2xl font-bold text-red-500">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through ml-2">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-3">
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
