// src/components/pages/Home/Home.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast"; // 🆕 Modern toast
import { motion } from "framer-motion"; // 🆕 For animations
import { CgMouse } from "react-icons/cg";

// 🆕 Updated imports for Redux Toolkit
import {
  getProducts,
  clearErrors,
  selectProducts,
  selectProductLoading,
  selectProductError,
} from "../../features/products/productSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import ProductCard from "./ProductCard";

const Home = () => {
  const dispatch = useDispatch();

  // 🆕 Using Redux Toolkit selectors
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  useEffect(() => {
    // Fetch products when component mounts
    dispatch(getProducts({}));
  }, [dispatch]);

  useEffect(() => {
    // Show error if any using react-hot-toast
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ff4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "10px",
        },
      });
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="ECOMMERCE - Shop Now" />

          {/* 🎯 Hero Banner Section - Enhanced */}
          <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
            {/* Animated Background with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
              style={{
                backgroundImage: 'url("/images/cover.jfif")',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            </div>

            {/* Animated floating particles - Optional decorative */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  animate={{
                    y: [0, -100, 0],
                    x: [0, 50, 0],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative text-center z-10 px-4 max-w-4xl"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl mb-4 tracking-wider font-light"
              >
                Welcome to Ecommerce
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
              >
                FIND AMAZING <br className="hidden sm:block" />
                <span className="text-red-400">PRODUCTS</span> BELOW
              </motion.h1>

              <motion.a
                href="#container"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all duration-300 shadow-2xl hover:shadow-none"
              >
                Scroll <CgMouse className="inline-block ml-2 animate-bounce" />
              </motion.a>
            </motion.div>

            {/* Decorative bottom curve */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 100" className="w-full">
                <path
                  fill="#ffffff"
                  d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,80 1440,85 L1440,100 L0,100 Z"
                ></path>
              </svg>
            </div>
          </section>

          {/* 🛍️ Featured Products Section - Enhanced */}
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured <span className="text-red-500">Products</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-300 mx-auto rounded-full"></div>
              <p className="text-gray-500 mt-4">
                Discover our handpicked collection
              </p>
            </motion.div>

            <motion.div
              id="container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {products &&
                products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
            </motion.div>

            {/* Show if no products */}
            {products?.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
