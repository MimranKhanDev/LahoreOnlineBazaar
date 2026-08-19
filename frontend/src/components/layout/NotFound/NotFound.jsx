// src/components/layout/NotFound/NotFound.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdErrorOutline, MdHome, MdArrowBack } from "react-icons/md";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-20"
    >
      <div className="text-center max-w-lg">
        {/* 🎯 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="text-8xl md:text-9xl font-bold text-red-500/10 select-none">
            404
          </div>
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MdErrorOutline className="text-7xl md:text-8xl text-red-500" />
          </motion.div>
        </motion.div>

        {/* 📝 Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* 🎯 Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <MdHome className="text-xl" />
                Go Home
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all"
              >
                <MdArrowBack className="text-xl" />
                Go Back
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* 🔍 Search Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-400 mb-3">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Products", "About", "Contact", "Cart"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="px-4 py-2 bg-white rounded-full text-gray-600 hover:text-red-500 hover:shadow-md transition-all text-sm"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;
