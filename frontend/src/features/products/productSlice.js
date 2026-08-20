// src/features/products/productSlice.js

/**
 * 📦 PRODUCT SLICE - Manages products, reviews, and admin operations
 *
 * This file replaces THREE files from old Redux:
 * 1. constants/productConstants.js
 * 2. actions/productAction.js
 * 3. reducers/productReducer.js
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/v1";

/**
 * 📋 Get All Products (with filters)
 */
export const getProducts = createAsyncThunk(
  "products/getAll",
  async ({
    keyword = "",
    currentPage = 1,
    price = [0, 25000],
    category = "",
    ratings = 0,
  }) => {
    // Build the query string
    let link = `${API_URL}/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

    if (category) {
      link += `&category=${category}`;
    }

    const { data } = await axios.get(link);
    return data; // { products, productsCount, resultPerPage, filteredProductsCount }
  },
);

/**
 * 📋 Get All Products for Admin
 */
export const getAdminProducts = createAsyncThunk(
  "products/getAdmin",
  async () => {
    const { data } = await axios.get(`${API_URL}/admin/products`);
    return data.products;
  },
);

/**
 * ➕ Create New Product (Admin only)
 */
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData) => {
    const { data } = await axios.post(
      `${API_URL}/admin/product/new`,
      productData,
      { headers: { "Content-Type": "application/json" } },
    );
    return data;
  },
);

/**
 * ✏️ Update Product (Admin only)
 */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData }) => {
    const { data } = await axios.put(
      `${API_URL}/admin/product/${id}`,
      productData,
      { headers: { "Content-Type": "application/json" } },
    );
    return data.success;
  },
);

/**
 * 🗑️ Delete Product (Admin only)
 */
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  const { data } = await axios.delete(`${API_URL}/admin/product/${id}`);
  return data.success;
});

/**
 * 🔍 Get Single Product Details
 */
export const getProductDetails = createAsyncThunk(
  "products/getDetails",
  async (id) => {
    const { data } = await axios.get(`${API_URL}/product/${id}`);
    return data.product;
  },
);

/**
 * ⭐ Create/Update Product Review
 */
export const createReview = createAsyncThunk(
  "products/createReview",
  async (reviewData) => {
    const { data } = await axios.put(`${API_URL}/review`, reviewData, {
      headers: { "Content-Type": "application/json" },
    });
    return data.success;
  },
);

/**
 * 📋 Get All Reviews for a Product (Admin only)
 */
export const getProductReviews = createAsyncThunk(
  "products/getReviews",
  async (productId) => {
    const { data } = await axios.get(`${API_URL}/reviews?id=${productId}`);
    return data.reviews;
  },
);

/**
 * 🗑️ Delete Review (Admin only)
 */
export const deleteReview = createAsyncThunk(
  "products/deleteReview",
  async ({ reviewId, productId }) => {
    const { data } = await axios.delete(
      `${API_URL}/reviews?id=${reviewId}&productId=${productId}`,
    );
    return data.success;
  },
);

/**
 * 🎨 Product Slice
 */
const productSlice = createSlice({
  name: "products",

  initialState: {
    // 🏪 All Products State
    products: [],
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
    loading: false,
    error: null,

    // 🔍 Single Product State
    product: null,
    productLoading: false,
    productError: null,

    // ⭐ Review State
    reviewSuccess: false,
    reviewLoading: false,
    reviewError: null,

    // 📋 Admin Products State
    adminProducts: [],
    adminLoading: false,
    adminError: null,

    // 📋 Reviews State (Admin)
    reviews: [],
    reviewsLoading: false,
    reviewsError: null,

    // 🗑️ Delete/Update Product Status
    isDeleted: false,
    isUpdated: false,

    // 📝 Delete Review Status
    reviewDeleted: false,
  },

  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.productError = null;
      state.reviewError = null;
      state.adminError = null;
      state.reviewsError = null;
    },
    clearProductStatus: (state) => {
      state.isDeleted = false;
      state.isUpdated = false;
      state.reviewDeleted = false;
      state.reviewSuccess = false;
    },
    resetProduct: (state) => {
      state.product = null;
      state.productLoading = false;
      state.productError = null;
    },
    // ✅ NEW: Reset review state after submission
    resetReviewState: (state) => {
      state.reviewSuccess = false;
      state.reviewLoading = false;
      state.reviewError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ============= GET ALL PRODUCTS =============
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount = action.payload.filteredProductsCount;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // ============= GET ADMIN PRODUCTS =============
      .addCase(getAdminProducts.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminProducts = action.payload;
        state.adminError = null;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError =
          action.error.message || "Failed to fetch admin products";
      })

      // ============= CREATE PRODUCT =============
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })

      // ============= UPDATE PRODUCT =============
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.isUpdated = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.error.message || "Failed to update product";
      })

      // ============= DELETE PRODUCT =============
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.isDeleted = false;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.isDeleted = false;
        state.error = action.error.message || "Failed to delete product";
      })

      // ============= GET PRODUCT DETAILS =============
      .addCase(getProductDetails.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload;
        state.productError = null;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          action.error.message || "Failed to fetch product details";
      })

      // ============= CREATE REVIEW =============
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewSuccess = false;
        state.reviewError = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
        state.reviewError = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = false;
        state.reviewError = action.error.message || "Failed to create review";
      })

      // ============= GET PRODUCT REVIEWS =============
      .addCase(getProductReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload;
        state.reviewsError = null;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || "Failed to fetch reviews";
      })

      // ============= DELETE REVIEW =============
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.reviewDeleted = false;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.loading = false;
        state.reviewDeleted = true;
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.reviewDeleted = false;
        state.error = action.error.message || "Failed to delete review";
      });
  },
});

/**
 * 📤 EXPORT SYNC ACTIONS
 */
export const {
  clearErrors,
  clearProductStatus,
  resetProduct,
  resetReviewState, // ✅ NEW: Export the reset action
} = productSlice.actions;

/**
 * 📤 EXPORT SELECTORS
 */
export const selectProducts = (state) => state.products.products;
export const selectProductLoading = (state) => state.products.loading;
export const selectProductError = (state) => state.products.error;
export const selectProductDetails = (state) => state.products.product;
export const selectProductDetailsLoading = (state) =>
  state.products.productLoading;
export const selectProductDetailsError = (state) => state.products.productError;
export const selectProductsCount = (state) => state.products.productsCount;
export const selectResultPerPage = (state) => state.products.resultPerPage;
export const selectFilteredProductsCount = (state) =>
  state.products.filteredProductsCount;

// ✅ NEW: Review selectors
export const selectReviewSuccess = (state) => state.products.reviewSuccess;
export const selectReviewLoading = (state) => state.products.reviewLoading;
export const selectReviewError = (state) => state.products.reviewError;

/**
 * 📤 EXPORT REDUCER
 */
export default productSlice.reducer;
