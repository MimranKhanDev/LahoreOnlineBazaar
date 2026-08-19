// src/components/pages/Home/Home.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { CgMouse } from "react-icons/cg";
import { getProduct, clearErrors } from "../../../actions/productAction";
import Loader from "../../layout/Loader/Loader";
import MetaData from "../../layout/MetaData";
import ProductCard from "./ProductCard";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  // Get products from Redux store
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch products when component mounts
    dispatch(getProduct());

    // Show error if any
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="ECOMMERCE - Shop Now" />

          {/* Hero Banner Section */}
          <section className="relative h-screen flex items-center justify-center text-white">
            {/* Background with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("/images/cover.jfif")',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative text-center z-10 px-4">
              <p className="text-xl md:text-2xl mb-4 tracking-wider">
                Welcome to Ecommerce
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-8">
                FIND AMAZING PRODUCTS BELOW
              </h1>

              <a
                href="#container"
                className="inline-block bg-white text-black px-8 py-3 rounded-md hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all duration-300"
              >
                Scroll <CgMouse className="inline-block ml-2" />
              </a>
            </div>

            {/* Decorative bottom curve */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 100" className="w-full">
                <path
                  fill="white"
                  d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,80 1440,85 L1440,100 L0,100 Z"
                ></path>
              </svg>
            </div>
          </section>

          {/* Featured Products Section */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 pb-4 border-b-2 border-gray-200 max-w-md mx-auto">
              Featured Products
            </h2>

            <div
              id="container"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
