import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaStore,
} from "react-icons/fa";
import logo from "../../../images/logo.jpg";

import { selectCartItems } from "../../../features/cart/cartSlice";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../../features/user/userSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const cartItems = useSelector(selectCartItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🎯 Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
      setIsMenuOpen(false);
    } else {
      navigate("/products");
    }
  };

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* 🏪 Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img src={logo} alt="Logo" className="h-10 w-auto md:h-12" />
            </motion.div>
            <span className="text-xl md:text-2xl font-bold text-red-500 group-hover:text-red-600 transition-colors">
              ECOMMERCE
            </span>
          </Link>

          {/* 🔍 Search Bar - Desktop */}
          <form
            onSubmit={searchSubmitHandler}
            className="hidden md:flex items-center flex-1 max-w-xl mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-5 py-2.5 pl-12 border-2 border-gray-200 rounded-full focus:outline-none focus:border-red-500 transition-colors bg-gray-50 hover:bg-white"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="submit"
              className="ml-2 bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 transition-colors font-medium"
            >
              Search
            </button>
          </form>

          {/* 🛒 Right Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <FaShoppingCart className="text-2xl text-gray-700 group-hover:text-red-500 transition-colors" />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User */}
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="flex items-center gap-2 group"
            >
              {isAuthenticated && user ? (
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <img
                    src={user.avatar?.url || "/Profile.png"}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border-2 border-gray-300 group-hover:border-red-500 transition-colors object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors"
                >
                  <FaUser className="text-xl text-gray-600 group-hover:text-red-500 transition-colors" />
                </motion.div>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTimes className="text-2xl text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaBars className="text-2xl text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* 📋 Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 py-3 border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 hover:text-red-500 transition-colors font-medium relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-red-500 transition-colors font-medium relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </nav>

        {/* 📱 Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-gray-200">
                {/* Mobile Search */}
                <form onSubmit={searchSubmitHandler} className="flex mb-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-l-lg focus:outline-none focus:border-red-500 transition-colors"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-6 rounded-r-lg hover:bg-red-600 transition-colors"
                  >
                    <FaSearch />
                  </button>
                </form>

                {/* Mobile Links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {isAuthenticated && user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
