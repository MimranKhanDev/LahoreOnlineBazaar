// src/components/Cart/OrderSuccess.jsx

/**
 * ✅ ORDER SUCCESS - Order confirmation page
 *
 * Features:
 * 1. Success animation
 * 2. Order confirmation message
 * 3. Links to view orders or continue shopping
 *
 * 📦 Packages Used:
 * - framer-motion: v9+ (animations)
 * - react-icons: v4+ (icons)
 */

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";

import MetaData from "../layout/MetaData";

const OrderSuccess = () => {
  return (
    <>
      <MetaData title="Order Success | ECOMMERCE" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          {/* ✅ Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-6xl text-green-500" />
          </motion.div>

          {/* 🎉 Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Order Placed Successfully! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 mb-8"
          >
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </motion.p>

          {/* 🔗 Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Link
              to="/orders"
              className="block w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <FaShoppingBag className="inline mr-2" />
              View My Orders
            </Link>

            <Link
              to="/"
              className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              <FaHome className="inline mr-2" />
              Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSuccess;
