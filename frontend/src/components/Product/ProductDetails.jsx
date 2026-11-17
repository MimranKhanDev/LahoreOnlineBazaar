import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Carousel from "react-material-ui-carousel";
import toast from "react-hot-toast";
import Rating from "@mui/material/Rating";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaRegStar,
  FaCheckCircle,
  FaTimesCircle,
  FaShare,
  FaHeart,
} from "react-icons/fa";
import {
  getProductDetails,
  clearErrors,
  createReview,
  resetReviewState,
  selectProductDetails,
  selectProductDetailsLoading,
  selectProductDetailsError,
} from "../../features/products/productSlice";

// ✅ Cart actions
import { addToCart } from "../../features/cart/cartSlice";

// ✅ User Auth state
import { selectIsAuthenticated } from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const product = useSelector(selectProductDetails);
  const loading = useSelector(selectProductDetailsLoading);
  const error = useSelector(selectProductDetailsError);

  // ✅ Safe destructuring for review state
  const reviewState = useSelector((state) => state.products) || {};
  const {
    reviewSuccess = false,
    reviewLoading = false,
    reviewError = null,
  } = reviewState;

  // 🎨 Local state
  const [quantity, setQuantity] = useState(1);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // ⭐ Rating options
  const ratingOptions = {
    size: "large",
    value: product?.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  const increaseQuantity = () => {
    if (product?.Stock <= quantity) {
      toast.error("Maximum stock limit reached");
      return;
    }
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    setQuantity(quantity - 1);
  };

  const addToCartHandler = () => {
    if (!product || !product._id) {
      toast.error("Product not available");
      return;
    }

    const cartItem = {
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      stock: product.Stock,
      quantity: quantity,
    };

    dispatch(addToCart(cartItem));
    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
      duration: 3000,
    });
  };

  const toggleReviewDialog = () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }
    setOpenReviewDialog(!openReviewDialog);
    if (!openReviewDialog) {
      setRating(0);
      setComment("");
    }
  };

  const reviewSubmitHandler = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const reviewData = {
      rating: rating,
      comment: comment,
      productId: id,
    };

    dispatch(createReview(reviewData));
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const shareProduct = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ECOMMERCE!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Fetch product on mount
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  // Handle Errors and Review Success
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }

    if (reviewSuccess) {
      toast.success("Review submitted successfully! 🎉");
      setOpenReviewDialog(false);
      dispatch(resetReviewState());
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id, error, reviewError, reviewSuccess]);

  if (loading) return <Loader />;

  if (!product || !product._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-700">
            Product Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <MetaData title={`${product.name} | ECOMMERCE`} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* 📸 Left: Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center p-4">
                  <img
                    src={
                      product.images?.[activeImage]?.url || "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? "border-red-500 shadow-lg"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={item.url || "/placeholder.jpg"}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 📝 Right: Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Product ID: #{product._id.slice(-8)}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Rating {...ratingOptions} />
                  <span className="text-sm text-gray-600">
                    ({product.numOfReviews || 0} reviews)
                  </span>
                </div>
                {product.Stock > 0 ? (
                  <Chip
                    icon={<FaCheckCircle className="text-green-500" />}
                    label="In Stock"
                    color="success"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                ) : (
                  <Chip
                    icon={<FaTimesCircle className="text-red-500" />}
                    label="Out of Stock"
                    color="error"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </div>

              <div className="flex items-end gap-3">
                <h2 className="text-4xl font-bold text-red-500">
                  ${product.price}
                </h2>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <input
                    type="number"
                    readOnly
                    value={quantity}
                    id="quantity"
                    name="quantity"
                    className="w-16 text-center py-2 bg-white outline-none font-semibold"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={increaseQuantity}
                    disabled={product.Stock <= quantity}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addToCartHandler}
                  disabled={product.Stock < 1}
                  className="flex-1 min-w-[180px] px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  aria-label="Add to cart"
                >
                  <FaShoppingCart />
                  {product.Stock < 1 ? "Out of Stock" : "Add to Cart"}
                </motion.button>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleWishlist}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-red-500 transition-all flex items-center gap-2"
                  aria-label="Toggle wishlist"
                >
                  <FaHeart
                    className={isWishlisted ? "text-red-500" : "text-gray-400"}
                  />
                  <span className="text-sm">
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareProduct}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-all flex items-center gap-2"
                  aria-label="Share product"
                >
                  <FaShare className="text-gray-400" />
                  <span className="text-sm">Share</span>
                </motion.button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium capitalize">
                    {product.category || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-medium">{product.Stock} units</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleReviewDialog}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                aria-label="Submit review"
              >
                {reviewLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Review"
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* ⭐ Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              Customer <span className="text-red-500">Reviews</span>
            </h3>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-3xl">
                <FaRegStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 📝 Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={toggleReviewDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle className="text-2xl font-bold text-center border-b">
          ⭐ Submit Your Review
        </DialogTitle>

        <DialogContent className="mt-4">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                How would you rate this product?
              </p>
              <Rating
                size="large"
                value={rating}
                onChange={(e, newValue) => setRating(newValue || 0)}
                precision={0.5}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#ef4444",
                  },
                }}
              />
            </div>

            <textarea
              id="review-comment"
              name="review-comment"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors resize-none"
              aria-label="Review comment"
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px", gap: "8px" }}>
          <Button
            onClick={toggleReviewDialog}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "12px", px: 4 }}
          >
            Cancel
          </Button>
          <Button
            onClick={reviewSubmitHandler}
            variant="contained"
            color="primary"
            disabled={reviewLoading}
            sx={{
              borderRadius: "12px",
              px: 4,
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              },
            }}
          >
            {reviewLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ProductDetails;
