// src/components/Admin/Sidebar.jsx

/**
 * 📋 SIDEBAR - Admin navigation sidebar
 *
 * Features:
 * 1. Dashboard link
 * 2. Products tree (All, Create)
 * 3. Orders link
 * 4. Users link
 * 5. Reviews link
 *
 * 📦 Packages Used:
 * - @mui/icons-material: v5+ (icons)
 * - react-router-dom: v6 (navigation)
 * - framer-motion: v9+ (animations)
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  ExpandMore,
  ExpandLess,
  PostAdd,
  Add,
  ListAlt,
  People,
  RateReview,
  Storefront,
} from "@mui/icons-material";
import logo from "../../images/logo.jpg";

const Sidebar = () => {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  /**
   * 🎯 Check if link is active
   */
  const isActive = (path) => location.pathname === path;

  /**
   * 🎨 Navigation links configuration
   */
  const navLinks = [
    {
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
      label: "Dashboard",
    },
    {
      type: "tree",
      icon: <Storefront />,
      label: "Products",
      children: [
        { path: "/admin/products", icon: <PostAdd />, label: "All Products" },
        { path: "/admin/product", icon: <Add />, label: "Create Product" },
      ],
    },
    {
      path: "/admin/orders",
      icon: <ListAlt />,
      label: "Orders",
    },
    {
      path: "/admin/users",
      icon: <People />,
      label: "Users",
    },
    {
      path: "/admin/reviews",
      icon: <RateReview />,
      label: "Reviews",
    },
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-40 overflow-y-auto"
    >
      {/* 🏪 Logo */}
      <Link to="/" className="block p-4 border-b border-gray-100">
        <img
          src={logo}
          alt="ECOMMERCE"
          className="h-12 w-auto mx-auto hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* 📋 Navigation */}
      <nav className="p-3 space-y-1">
        {navLinks.map((link, index) => {
          // Tree item (Products with children)
          if (link.type === "tree") {
            return (
              <div key={index}>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isProductsOpen
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </span>
                  {isProductsOpen ? <ExpandLess /> : <ExpandMore />}
                </button>

                {/* Children */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isProductsOpen ? "auto" : 0,
                    opacity: isProductsOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden ml-4"
                >
                  <div className="space-y-1 pl-4 border-l-2 border-gray-100">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                          isActive(child.path)
                            ? "bg-red-50 text-red-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-lg">{child.icon}</span>
                        <span className="text-sm">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          }

          // Regular link
          return (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(link.path)
                  ? "bg-red-50 text-red-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
              {isActive(link.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-6 bg-red-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 🔒 Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <span>← Back to Store</span>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
