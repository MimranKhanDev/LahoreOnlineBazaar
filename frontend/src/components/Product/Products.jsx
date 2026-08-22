// src/components/Product/Products.jsx

/**
 * 📋 PRODUCTS - Displays product listing with filters
 * Features:
 * 1. Product grid with cards
 * 2. Price filter (slider) - Using @mui/material/Slider
 * 3. Category filter - Using @mui/material/Chip
 * 4. Rating filter - Using @mui/material/Slider
 * 5. Pagination - Using react-js-pagination
 * 6. Search functionality
 *
 * 📦 Packages Used:
 * - @mui/material: v5+ (Slider, Chip, Typography)
 * - react-js-pagination: v3+
 * - framer-motion: v9+ (animations)
 */

import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Pagination from "react-js-pagination";
import { Slider, Typography, Chip } from "@mui/material";
import {
  FaFilter,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import toast from "react-hot-toast";

// ✅ Redux Toolkit imports
import {
  getProducts,
  clearErrors,
  selectProducts,
  selectProductLoading,
  selectProductError,
  selectProductsCount,
  selectResultPerPage,
  selectFilteredProductsCount,
} from "../../features/products/productSlice";

import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import MetaData from "../layout/MetaData";

const Products = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();

  // 🎯 State
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 1000000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // 📊 Selectors
  const products = useSelector(selectProducts) || [];
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const productsCount = useSelector(selectProductsCount);
  const resultPerPage = useSelector(selectResultPerPage);
  const filteredProductsCount = useSelector(selectFilteredProductsCount);

  // 📂 Categories
  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
    "Accessories",
  ];

  /**
   * 📄 Handle page change
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * 💰 Handle price range change from slider
   */
  const handlePriceChange = (event, newPrice) => {
    setPrice(newPrice);
  };

  /**
   * 🏷️ Handle category click - Toggle category selection
   */
  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName === category ? "" : categoryName);
    setCurrentPage(1);
  };

  /**
   * ⭐ Handle ratings change from slider
   */
  const handleRatingsChange = (event, newRating) => {
    setRatings(newRating);
    setCurrentPage(1);
  };

  /**
   * 🔄 Clear all filters
   */
  const clearFilters = () => {
    setPrice([0, 25000]);
    setCategory("");
    setRatings(0);
    setCurrentPage(1);
  };

  // 🔄 Fetch products when filters change
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(
      getProducts({
        keyword: keyword || "",
        currentPage,
        price,
        category,
        ratings,
      }),
    );
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);

  return (
    <Fragment>
      <MetaData title="Products | ECOMMERCE" />

      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* 🎯 Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {keyword ? `Results for "${keyword}"` : "All Products"}
              </h1>
              <p className="text-gray-500">
                {filteredProductsCount || 0} products found
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* 🎯 Filter Sidebar - Desktop */}
              <div className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FaFilter className="text-red-500" />
                      Filters
                    </h3>
                    {(price[0] > 0 ||
                      price[1] < 25000 ||
                      category ||
                      ratings > 0) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Price Filter */}
                  <div className="mb-6">
                    <Typography className="font-semibold mb-2">
                      Price Range
                    </Typography>
                    <Slider
                      value={price}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={25000}
                      sx={{
                        color: "#ef4444",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "#ef4444",
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: "#ef4444",
                        },
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>₹{price[0]}</span>
                      <span>₹{price[1]}</span>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <Typography className="font-semibold mb-2">
                      Categories
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Chip
                          key={cat}
                          label={cat}
                          onClick={() => handleCategoryClick(cat)}
                          color={category === cat ? "primary" : "default"}
                          sx={{
                            backgroundColor:
                              category === cat ? "#ef4444" : "#f3f4f6",
                            color: category === cat ? "white" : "#374151",
                            "&:hover": {
                              backgroundColor:
                                category === cat ? "#dc2626" : "#e5e7eb",
                            },
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Ratings Filter */}
                  <div>
                    <Typography className="font-semibold mb-2">
                      Rating
                    </Typography>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={ratings}
                        onChange={handleRatingsChange}
                        min={0}
                        max={5}
                        step={0.5}
                        valueLabelDisplay="auto"
                        sx={{
                          color: "#ef4444",
                          "& .MuiSlider-thumb": {
                            backgroundColor: "#ef4444",
                          },
                          "& .MuiSlider-track": {
                            backgroundColor: "#ef4444",
                          },
                        }}
                      />
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400" />
                        <span className="ml-1 font-semibold">{ratings}+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🎯 Mobile Filter Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-red-500" />
                    <span className="font-semibold">Filters</span>
                    {(price[0] > 0 ||
                      price[1] < 25000 ||
                      category ||
                      ratings > 0) && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <span>
                    {showFilters ? <FaChevronRight /> : <FaChevronLeft />}
                  </span>
                </button>

                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mt-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Filters</h3>
                      {(price[0] > 0 ||
                        price[1] < 25000 ||
                        category ||
                        ratings > 0) && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-red-500 font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <Typography className="font-semibold mb-2">
                        Price
                      </Typography>
                      <Slider
                        value={price}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={25000}
                        sx={{ color: "#ef4444" }}
                      />
                    </div>

                    <div className="mb-4">
                      <Typography className="font-semibold mb-2">
                        Categories
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Chip
                            key={cat}
                            label={cat}
                            onClick={() => handleCategoryClick(cat)}
                            color={category === cat ? "primary" : "default"}
                            sx={{
                              backgroundColor:
                                category === cat ? "#ef4444" : "#f3f4f6",
                              color: category === cat ? "white" : "#374151",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <Typography className="font-semibold mb-2">
                        Rating
                      </Typography>
                      <Slider
                        value={ratings}
                        onChange={handleRatingsChange}
                        min={0}
                        max={5}
                        step={0.5}
                        valueLabelDisplay="auto"
                        sx={{ color: "#ef4444" }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 🎯 Product Grid */}
              <div className="flex-1">
                {products && products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {products.map((product, index) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination - Only show if more than 1 page */}
                    {resultPerPage < filteredProductsCount && (
                      <div className="flex justify-center mt-12">
                        <Pagination
                          activePage={currentPage}
                          itemsCountPerPage={resultPerPage}
                          totalItemsCount={productsCount}
                          onChange={handlePageChange}
                          nextPageText={<FaChevronRight />}
                          prevPageText={<FaChevronLeft />}
                          firstPageText="First"
                          lastPageText="Last"
                          itemClass="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                          linkClass="text-gray-700 hover:text-red-500 transition-colors"
                          activeClass="!bg-red-500 !border-red-500"
                          activeLinkClass="!text-white"
                          disabledClass="opacity-50 cursor-not-allowed"
                          itemClassFirst="rounded-l-lg"
                          itemClassLast="rounded-r-lg"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Products;
