// src/components/layout/Header/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import logo from '../../../images/logo.png'; // Adjust path as needed

const Header = () => {
  // State for mobile menu toggle - when screen is small, we show/hide menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for search query - what user types in search bar
  const [keyword, setKeyword] = useState('');
  
  // Get cart items from Redux store to show count
  const { cartItems } = useSelector((state) => state.cart);
  
  // Get user info from Redux store
  const { user } = useSelector((state) => state.user);
  
  // For navigation
  const navigate = useNavigate();

  // Handle search submission
  const searchSubmitHandler = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); // Navigate to search results
    } else {
      navigate('/products'); // If empty, go to all products
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-red-500 ml-2 hidden sm:inline">
              ECOMMERCE
            </span>
          </Link>

          {/* Search Bar - Center (hidden on mobile) */}
          <form 
            onSubmit={searchSubmitHandler}
            className="hidden md:flex items-center flex-1 max-w-xl mx-6"
          >
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-red-500"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-r-lg hover:bg-red-600 transition-colors"
            >
              <FaSearch />
            </button>
          </form>

          {/* Navigation Icons - Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Count */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-red-500 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            <Link to={user ? '/profile' : '/login'} className="flex items-center">
              {user ? (
                <img 
                  src={user.avatar?.url || '/Profile.png'} 
                  alt="Profile"
                  className="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-red-500 transition-colors"
                />
              ) : (
                <FaUser className="text-2xl text-gray-700 hover:text-red-500 transition-colors" />
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-2xl text-gray-700 hover:text-red-500 transition-colors"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Navigation Links - Desktop (below header) */}
        <nav className="hidden md:flex items-center justify-center space-x-8 mt-3 border-t pt-3">
          <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            Products
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            Contact
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            About
          </Link>
          {/* Admin Dashboard Link - only visible to admin */}
          {user && user.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Mobile Menu - Shows when isMenuOpen is true */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            {/* Mobile Search */}
            <form onSubmit={searchSubmitHandler} className="flex mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-red-500"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="bg-red-500 text-white px-4 rounded-r-lg">
                <FaSearch />
              </button>
            </form>
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              {user && user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;// src/components/layout/Header/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import logo from '../../../images/logo.png'; // Adjust path as needed

const Header = () => {
  // State for mobile menu toggle - when screen is small, we show/hide menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for search query - what user types in search bar
  const [keyword, setKeyword] = useState('');
  
  // Get cart items from Redux store to show count
  const { cartItems } = useSelector((state) => state.cart);
  
  // Get user info from Redux store
  const { user } = useSelector((state) => state.user);
  
  // For navigation
  const navigate = useNavigate();

  // Handle search submission
  const searchSubmitHandler = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); // Navigate to search results
    } else {
      navigate('/products'); // If empty, go to all products
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-red-500 ml-2 hidden sm:inline">
              ECOMMERCE
            </span>
          </Link>

          {/* Search Bar - Center (hidden on mobile) */}
          <form 
            onSubmit={searchSubmitHandler}
            className="hidden md:flex items-center flex-1 max-w-xl mx-6"
          >
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-red-500"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-r-lg hover:bg-red-600 transition-colors"
            >
              <FaSearch />
            </button>
          </form>

          {/* Navigation Icons - Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Count */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-red-500 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            <Link to={user ? '/profile' : '/login'} className="flex items-center">
              {user ? (
                <img 
                  src={user.avatar?.url || '/Profile.png'} 
                  alt="Profile"
                  className="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-red-500 transition-colors"
                />
              ) : (
                <FaUser className="text-2xl text-gray-700 hover:text-red-500 transition-colors" />
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-2xl text-gray-700 hover:text-red-500 transition-colors"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Navigation Links - Desktop (below header) */}
        <nav className="hidden md:flex items-center justify-center space-x-8 mt-3 border-t pt-3">
          <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            Products
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            Contact
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
            About
          </Link>
          {/* Admin Dashboard Link - only visible to admin */}
          {user && user.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Mobile Menu - Shows when isMenuOpen is true */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            {/* Mobile Search */}
            <form onSubmit={searchSubmitHandler} className="flex mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-red-500"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="bg-red-500 text-white px-4 rounded-r-lg">
                <FaSearch />
              </button>
            </form>
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              {user && user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;