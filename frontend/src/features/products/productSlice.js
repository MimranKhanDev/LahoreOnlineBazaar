// src/features/products/productSlice.js

/**
 * 📦 PRODUCT SLICE - Manages products, reviews, and admin operations
 *
 * This is like the "Products Department" in our warehouse
 * It handles:
 * 1. Fetching products from the server (API calls)
 * 2. Creating new products (admin)
 * 3. Updating products (admin)
 * 4. Deleting products (admin)
 * 5. Product reviews
 *
 * 🔄 REPLACES 3 OLD FILES:
 * - constants/productConstants.js
 * - actions/productAction.js
 * - reducers/productReducer.js
 *
 * 🌟 KEY CONCEPT: createAsyncThunk
 *    This is what makes API calls work with Redux
 *    It handles the 3 states of an API call:
 *    1. PENDING: "I'm fetching data..."
 *    2. FULFILLED: "I got the data!"
 *    3. REJECTED: "Something went wrong"
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⚙️ API Base URL
// All our API endpoints start with /api/v1
// Example: /api/v1/products, /api/v1/login
const API_URL = "/api/v1";

/**
 * 🌟 ASYNC THUNK: What is it?
 *
 * Think of createAsyncThunk as a "super-powered action"
 * It handles API calls automatically!
 *
 * ❓ Why do we need this?
 *    Regular actions are synchronous (happen immediately)
 *    API calls are asynchronous (take time to complete)
 *    createAsyncThunk bridges this gap!
 *
 * ❓ How does it work?
 *    1. You call the thunk (like calling an API)
 *    2. It automatically dispatches 3 actions:
 *       - PENDING: When the request starts
 *       - FULFILLED: When the request succeeds
 *       - REJECTED: When the request fails
 *    3. You handle these in extraReducers
 *
 * ❓ What does each part mean?
 *    - 'products/getAll' → Action type prefix
 *    - async ({ keyword, ... }) → Function that makes the API call
 *    - return data → What gets sent to the reducer on success
 */

/**
 * 📋 Get All Products (with filters)
 *
 * 🎯 When to use: Home page, Products page, Search results
 *
 * 📥 Parameters (what you can filter by):
 *    - keyword: Search term (e.g., "iphone")
 *    - currentPage: Which page of results (for pagination)
 *    - price: Price range [min, max]
 *    - category: Product category
 *    - ratings: Minimum rating
 *
 * 📤 Returns: { products, productsCount, resultPerPage, filteredProductsCount }
 */
export const getProducts = createAsyncThunk(
  // 📛 Action type: 'products/getAll'
  "products/getAll",
  // 🔧 The actual API call function
  async ({
    keyword = "", // Default: empty (no search)
    currentPage = 1, // Default: first page
    price = [0, 1000000], // Default: include the seeded catalog price range
    category = "", // Default: no category filter
    ratings = 0, // Default: any rating
  }) => {
    // 🔨 Build the query string (the URL parameters)
    // Example: /api/v1/products?keyword=iphone&page=1&price[gte]=0&price[lte]=25000
    let link = `${API_URL}/products?keyword=${encodeURIComponent(
      keyword,
    )}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

    if (ratings > 0) {
      link += `&ratings[gte]=${ratings}`;
    }
    // ➕ Add category if provided
    if (category) {
      link += `&category=${category}`;
    }
    // 🌐 Make the API request
    const { data } = await axios.get(link);
    // 📦 Return the data (this becomes action.payload in fulfilled state)
    return data;
  },
);

/**
 * 📋 Get All Products for Admin
 *
 * 🎯 When to use: Admin dashboard (to manage products)
 *
 * 🔐 This is admin-only (authentication handled by backend)
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
 *
 * 🎯 When to use: Admin "Create Product" page
 *
 * 📥 Parameters: productData (form data with name, price, description, etc.)
 *
 * 📤 Returns: The created product data
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
 *
 * 🎯 When to use: Admin "Edit Product" page
 *
 * 📥 Parameters:
 *    - id: Product ID to update
 *    - productData: Updated product data
 *
 * 📤 Returns: success (boolean)
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
 *
 * 🎯 When to use: Admin product list (delete button)
 */
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  const { data } = await axios.delete(`${API_URL}/admin/product/${id}`);
  return data.success;
});

/**
 * 🔍 Get Single Product Details
 *
 * 🎯 When to use: Product Details page (when user clicks a product)
 *
 * 📥 Parameters: id - Product ID
 *
 * 📤 Returns: Product object with all details
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
 *
 * 🎯 When to use: Product Details page (user submits review)
 *
 * 📥 Parameters: reviewData { rating, comment, productId }
 *
 * 📤 Returns: success (boolean)
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
 *
 * 🎯 When to use: Admin "Manage Reviews" page
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
 * 🎨 Create Product Slice
 *
 * Now we create our "department" that handles all product-related state
 *
 * 🏗️ The slice has two types of reducers:
 * 1. reducers: For synchronous actions (like clearing errors)
 * 2. extraReducers: For async actions (from createAsyncThunk)
 *
 * ❓ What's the difference?
 *    - reducers: Actions you dispatch directly (clearErrors)
 *    - extraReducers: Auto-handled from createAsyncThunk
 */
const productSlice = createSlice({
  name: "products",

  /**
   * 🏪 Initial State - All the data this slice manages
   *
   * Think of this as all the "bins" in our products department
   * Each bin holds different data:
   * - products: All products from API
   * - product: Single product details
   * - reviews: Product reviews
   * - loading: Are we fetching data?
   * - error: Did something go wrong?
   */
  initialState: {
    // 🏪 All Products State (for product listing pages)
    products: [], // Array of product objects
    productsCount: 0, // Total number of products
    resultPerPage: 0, // Products per page
    filteredProductsCount: 0, // Products after filters applied
    loading: false, // Are we fetching products?
    error: null, // Error if any
    // 🔍 Single Product State (for product detail page)
    product: null, // Single product object
    productLoading: false, // Is product details loading?
    productError: null, // Error for product details
    // ⭐ Review State
    reviewSuccess: false, // Did review succeed?
    reviewLoading: false, // Is review being submitted?
    reviewError: null, // Review error
    // 📋 Admin Products State
    adminProducts: [], // All products for admin
    adminLoading: false, // Is admin products loading?
    adminError: null, // Admin products error
    // 📋 Reviews State (Admin)
    reviews: [], // All reviews for a product
    reviewsLoading: false, // Are reviews loading?
    reviewsError: null, // Reviews error
    // 🗑️ Delete/Update Product Status
    isDeleted: false, // Was product deleted?
    isUpdated: false, // Was product updated?
    reviewDeleted: false, // Was review deleted?
  },

  /**
   * 🔄 Synchronous Reducers
   *
   * These are actions that DON'T need API calls
   * They just update the state directly
   *
   * ❓ When to use these?
   *    - Clearing errors
   *    - Resetting states
   *    - Any action that doesn't need server communication
   */
  reducers: {
    /**
     * 🧹 Clear Errors
     *
     * Used to clear error messages after showing them
     * Example: After showing "Product not found", clear the error
     */
    clearErrors: (state) => {
      // Reset all error states to null
      state.error = null;
      state.productError = null;
      state.reviewError = null;
      state.adminError = null;
      state.reviewsError = null;
    },

    /**
     * 🧹 Clear Product Status
     *
     * Used after delete/update operations
     * Resets success flags so they don't trigger again
     */
    clearProductStatus: (state) => {
      state.isDeleted = false;
      state.isUpdated = false;
      state.reviewDeleted = false;
      state.reviewSuccess = false;
    },

    /**
     * 🧹 Reset Product
     *
     * Used when navigating away from product details
     * Clears product data so old data doesn't show
     */
    resetProduct: (state) => {
      state.product = null;
      state.productLoading = false;
      state.productError = null;
    },

    /**
     * 🧹 Reset Review State
     *
     * Used after review is submitted
     * Resets review success flag
     */
    resetReviewState: (state) => {
      state.reviewSuccess = false;
      state.reviewLoading = false;
      state.reviewError = null;
    },
  },

  /**
   * ⚡ Async Reducers (extraReducers)
   *
   * These handle the 3 states of async actions:
   * 1. PENDING: "Loading..."
   * 2. FULFILLED: "Success!"
   * 3. REJECTED: "Failed!"
   *
   * ❓ Why use builder pattern?
   *    It's the modern way to add cases
   *    More type-safe and cleaner
   *
   * ❓ What does addCase do?
   *    It says: "When this action happens, do this"
   *    Example: .addCase(getProducts.pending, (state) => { ... })
   *    Means: "When getProducts starts loading, set loading = true"
   */
  extraReducers: (builder) => {
    builder
      // ============= GET ALL PRODUCTS =============
      // 📥 PENDING: Request is being sent
      .addCase(getProducts.pending, (state) => {
        state.loading = true; // Show loading spinner
        state.error = null; // Clear previous errors
      })
      // ✅ FULFILLED: Request succeeded
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false; // Hide loading spinner
        state.products = action.payload.products; // Store products
        state.productsCount = action.payload.productsCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount = action.payload.filteredProductsCount;
        state.error = null; // No error
      })
      // ❌ REJECTED: Request failed
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false; // Hide loading spinner
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
        state.loading = true; // Show loading while creating
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true; // Flag for success
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
        state.isUpdated = true; // Flag for success
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
        state.isDeleted = true; // Flag for success
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.isDeleted = false;
        state.error = action.error.message || "Failed to delete product";
      })

      // ============= GET PRODUCT DETAILS =============
      .addCase(getProductDetails.pending, (state) => {
        state.productLoading = true; // Show loading spinner
        state.productError = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload; // Store product details
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
        state.reviewSuccess = true; // Flag for success
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
        state.reviewDeleted = true; // Flag for success
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
 * 📤 STEP 4: Export Sync Actions
 *
 * These are the actions we dispatch directly
 * Example: dispatch(clearErrors())
 */
export const {
  clearErrors,
  clearProductStatus,
  resetProduct,
  resetReviewState,
} = productSlice.actions;

/**
 * 📤 STEP 5: Export Selectors
 *
 * These are our "receptionists" that get data from the store
 *
 * ❓ Why so many selectors?
 *    Each component needs different data
 *    Home page needs products
 *    Product details page needs single product
 *    Admin needs admin products
 *
 * ❓ How to use in components?
 *    const products = useSelector(selectProducts);
 *    const loading = useSelector(selectProductLoading);
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
export const selectAdminProducts = (state) => state.products.adminProducts;
export const selectAdminLoading = (state) => state.products.adminLoading;
export const selectAdminError = (state) => state.products.adminError;

// Review selectors
export const selectReviewSuccess = (state) => state.products.reviewSuccess;
export const selectReviewLoading = (state) => state.products.reviewLoading;
export const selectReviewError = (state) => state.products.reviewError;

/**
 * 📤 STEP 6: Export Reducer
 *
 * The reducer that gets added to the store
 * It's auto-generated by createSlice
 */
export default productSlice.reducer;
