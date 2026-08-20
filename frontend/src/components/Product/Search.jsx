// src/components/Product/Search.jsx

/**
 * 🔍 SEARCH - Product search page
 *
 * This component provides:
 * 1. Search input with clear button
 * 2. Popular search suggestions
 * 3. Redirect to products page with keyword
 * 4. Clean, modern UI with animations
 *
 * 📦 Packages Used:
 * - framer-motion: v9+ (animations)
 * - react-hot-toast: v2+ (toast notifications)
 * - react-icons: v4+ (icons)
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaTimes, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const Search = () => {
  // 🎯 State - Track what user types
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  /**
   * 🔄 Handle search submission
   * - If keyword exists: Navigate to products with keyword
   * - If empty: Navigate to all products
   */
  const searchSubmitHandler = (e) => {
    e.preventDefault(); // Prevent page refresh

    if (keyword.trim()) {
      // Navigate to products page with search keyword
      navigate(`/products/${keyword.trim()}`);
      toast.success(`Searching for "${keyword.trim()}"`);
    } else {
      // If empty, go to all products
      navigate("/products");
      toast.info("Showing all products");
    }
  };

  /**
   * 🧹 Clear search input
   */
  const clearSearch = () => {
    setKeyword("");
  };

  return (
    <>
      <MetaData title="Search Products | ECOMMERCE" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* 🏷️ Logo / Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-red-500 mb-2"
            >
              Search
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-lg"
            >
              Find your favorite products
            </motion.p>
          </div>

          {/* 🔍 Search Form */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <form onSubmit={searchSubmitHandler} className="relative">
              <div className="relative flex items-center">
                {/* 🔍 Search Icon */}
                <FaSearch className="absolute left-4 text-gray-400 text-lg" />

                {/* 📝 Input Field */}
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-lg placeholder-gray-400"
                  autoFocus // Auto-focus on page load
                />

                {/* ❌ Clear Button - Only shows when keyword exists */}
                {keyword && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-24 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}

                {/* ➡️ Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="absolute right-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Search
                  <FaArrowRight className="text-sm" />
                </motion.button>
              </div>
            </form>

            {/* 💡 Quick Suggestions */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {["Laptop", "SmartPhone", "Shoes", "Camera", "Headphones"].map(
                  (suggestion) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setKeyword(suggestion);
                        // Navigate after a short delay for smooth UX
                        setTimeout(() => {
                          navigate(`/products/${suggestion}`);
                          toast.success(`Searching for "${suggestion}"`);
                        }, 300);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-all"
                    >
                      {suggestion}
                    </motion.button>
                  ),
                )}
              </div>
            </div>

            {/* 📋 Browse All Products Link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/products")}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Or browse all products →
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Search;
