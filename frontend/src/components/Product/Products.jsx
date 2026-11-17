import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Slider, Typography, Chip } from "@mui/material";
import {
  FaFilter,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import toast from "react-hot-toast";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("");

  const [price, setPrice] = useState([0, 200000]);
  const [ratings, setRatings] = useState(0);

  const [filterPrice, setFilterPrice] = useState([0, 200000]);
  const [filterRatings, setFilterRatings] = useState(0);

  const products = useSelector(selectProducts) || [];
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const productsCount = useSelector(selectProductsCount);
  const resultPerPage = useSelector(selectResultPerPage);
  const filteredProductsCount = useSelector(selectFilteredProductsCount);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceChange = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handleRatingsChange = (event, newRating) => {
    setRatings(newRating);
  };

  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName === category ? "" : categoryName);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPrice([0, 200000]);
    setFilterPrice([0, 200000]);
    setCategory("");
    setRatings(0);
    setFilterRatings(0);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      getProducts({
        keyword: keyword || "",
        currentPage,
        price: filterPrice,
        category,
        ratings: filterRatings,
      }),
    );
  }, [dispatch, keyword, currentPage, filterPrice, category, filterRatings]);

  return (
    <Fragment>
      <MetaData title="Products | ECOMMERCE" />
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {keyword ? `Results for "${keyword}"` : "All Products"}
              </h1>
              <p className="text-gray-500">
                {filteredProductsCount || 0} products found
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Filters */}
              <div className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FaFilter className="text-red-500" /> Filters
                    </h3>
                    {(price[0] > 0 ||
                      price[1] < 200000 ||
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

                  <div className="mb-6">
                    <Typography className="font-semibold mb-2">
                      Price Range
                    </Typography>
                    <Slider
                      value={price}
                      onChange={handlePriceChange}
                      onChangeCommitted={(e, val) => {
                        setFilterPrice(val);
                        setCurrentPage(1);
                      }}
                      disableSwap
                      valueLabelDisplay="auto"
                      min={0}
                      max={200000}
                      sx={{
                        color: "#ef4444",
                        "& .MuiSlider-thumb": { backgroundColor: "#ef4444" },
                        "& .MuiSlider-track": { backgroundColor: "#ef4444" },
                      }}
                    />
                    <div className="flex justify-between text-sm font-bold text-gray-800 mt-2">
                      <span>${price[0].toLocaleString()}</span>
                      <span>${price[1].toLocaleString()}</span>
                    </div>
                  </div>

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

                  <div>
                    <Typography className="font-semibold mb-2">
                      Rating
                    </Typography>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={ratings}
                        onChange={handleRatingsChange}
                        onChangeCommitted={(e, val) => {
                          setFilterRatings(val);
                          setCurrentPage(1);
                        }}
                        disableSwap
                        min={0}
                        max={5}
                        step={0.5}
                        valueLabelDisplay="auto"
                        sx={{
                          color: "#ef4444",
                          "& .MuiSlider-thumb": { backgroundColor: "#ef4444" },
                          "& .MuiSlider-track": { backgroundColor: "#ef4444" },
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

              {/* Mobile Filters */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-red-500" />
                    <span className="font-semibold">Filters</span>
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
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-500 font-medium"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="mb-4">
                      <Typography className="font-semibold mb-2">
                        Price
                      </Typography>
                      <Slider
                        value={price}
                        onChange={handlePriceChange}
                        onChangeCommitted={(e, val) => {
                          setFilterPrice(val);
                          setCurrentPage(1);
                        }}
                        disableSwap
                        valueLabelDisplay="auto"
                        min={0}
                        max={200000}
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
                        onChangeCommitted={(e, val) => {
                          setFilterRatings(val);
                          setCurrentPage(1);
                        }}
                        disableSwap
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

              {/* Product Grid */}
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

                    {resultPerPage < filteredProductsCount && (
                      <div className="flex justify-center items-center mt-12 gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <FaChevronLeft />
                        </button>

                        {Array.from(
                          {
                            length: Math.ceil(
                              filteredProductsCount / resultPerPage,
                            ),
                          },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border font-medium transition-colors ${
                              currentPage === page
                                ? "bg-red-500 border-red-500 text-white shadow-md"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage ===
                            Math.ceil(filteredProductsCount / resultPerPage)
                          }
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <FaChevronRight />
                        </button>
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
