// src/components/Cart/CartItemCard.jsx

/**
 * 🏷️ CART ITEM CARD - Individual cart item display
 *
 * Features:
 * 1. Product image
 * 2. Product name (link to product page)
 * 3. Price display
 * 4. Quantity controls (increase/decrease)
 * 5. Remove button
 *
 * 📦 Packages Used:
 * - framer-motion: v9+ (animations)
 * - react-icons: v4+ (icons)
 */

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const CartItemCard = ({
  item,
  deleteCartItem,
  increaseQuantity,
  decreaseQuantity,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
      {/* 🖼️ Product Info - Left */}
      <div className="col-span-12 md:col-span-6 flex items-center gap-4">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={item.image}
          alt={item.name}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-md"
        />
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${item.product}`}
            className="font-medium text-gray-800 hover:text-red-500 transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          <p className="text-sm text-gray-500 mt-1">₹{item.price} each</p>
        </div>
      </div>

      {/* 🔢 Quantity Controls - Center */}
      <div className="col-span-8 md:col-span-3 flex items-center justify-start md:justify-center gap-2">
        <button
          onClick={() => decreaseQuantity(item.product, item.quantity)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <FaMinus className="text-xs" />
        </button>

        <span className="w-10 text-center font-semibold text-gray-700">
          {item.quantity}
        </span>

        <button
          onClick={() =>
            increaseQuantity(item.product, item.quantity, item.stock)
          }
          disabled={item.quantity >= item.stock}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <FaPlus className="text-xs" />
        </button>
      </div>

      {/* 💰 Subtotal - Right */}
      <div className="col-span-3 md:col-span-2 text-right font-semibold text-gray-800">
        ₹{(item.price * item.quantity).toFixed(2)}
      </div>

      {/* 🗑️ Remove Button */}
      <div className="col-span-1 text-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deleteCartItem(item.product)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <FaTrash className="text-sm" />
        </motion.button>
      </div>
    </div>
  );
};

export default CartItemCard;
