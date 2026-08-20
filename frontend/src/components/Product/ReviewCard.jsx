// src/components/Product/ReviewCard.jsx

/**
 * ⭐ REVIEW CARD - Displays individual review
 *
 * This component shows:
 * 1. User avatar and name
 * 2. Review rating (using @mui/material/Rating)
 * 3. Review comment
 * 4. Review date
 * 5. Helpful/Report buttons (UI only)
 *
 * 📦 Package Used:
 * - @mui/material/Rating: v5+
 */

import React from "react";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating"; // ✅ MUI v5
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import profilePng from "../../images/profile.jpg";

const ReviewCard = ({ review }) => {
  // ⭐ Rating options for MUI Rating component
  const ratingOptions = {
    value: review.rating || 0,
    readOnly: true, // User cannot change rating
    precision: 0.5, // Allow half stars
    size: "small",
  };

  /**
   * 📅 Format date for display
   * Converts ISO date string to "Month Day, Year" format
   * Example: "2024-01-15T10:30:00" → "January 15, 2024"
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      {/* 👤 User Info */}
      <div className="flex items-center gap-3 mb-3">
        {/* User Avatar - falls back to default if missing */}
        <img
          src={review.avatar || profilePng}
          alt={review.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = profilePng; // Fallback if image fails to load
          }}
        />
        <div>
          <p className="font-semibold text-gray-800 flex items-center gap-1">
            {review.name}
            {/* Show verification badge if user is verified */}
            {review.isVerified && (
              <FaCheckCircle className="text-blue-500 text-sm" />
            )}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaCalendarAlt />
            <span>{formatDate(review.createdAt || Date.now())}</span>
          </div>
        </div>
      </div>

      {/* ⭐ Rating */}
      <div className="mb-2">
        <Rating {...ratingOptions} />
      </div>

      {/* 💬 Comment */}
      <p className="text-gray-700 leading-relaxed">
        {review.comment || "No comment provided."}
      </p>

      {/* 👍 Helpful/Report Buttons - UI only for now */}
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
        <button className="hover:text-red-500 transition-colors">
          Helpful
        </button>
        <span>•</span>
        <button className="hover:text-red-500 transition-colors">Report</button>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
