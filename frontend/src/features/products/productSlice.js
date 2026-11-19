import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
export const getProducts = createAsyncThunk(
  "products/getAll",
  async ({
    keyword = "",
    currentPage = 1,
    price = [0, 1000000],
    category = "",
    ratings = 0,
  }) => {
    // Example: /api/v1/products?keyword=iphone&page=1&price[gte]=0&price[lte]=25000
    let link = `${API_URL}/products?keyword=${encodeURIComponent(
      keyword,
    )}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

    if (ratings > 0) {
      link += `&ratings[gte]=${ratings}`;
    }
    if (category) {
      link += `&category=${category}`;
    }
    const { data } = await axios.get(link);
    // 📦 Return the data (this becomes action.payload in fulfilled state)
    return data;
  },
);

export const getAdminProducts = createAsyncThunk(
  "products/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/products`, {
        withCredentials: true,
      });
      return data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/admin/product/new`,
        productData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/admin/product/${id}`,
        productData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/admin/product/${id}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getProductDetails = createAsyncThunk(
  "products/getDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/product/${id}`);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createReview = createAsyncThunk(
  "products/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/review`, reviewData, {
        headers: { "Content-Type": "application/json" },
      });
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getProductReviews = createAsyncThunk(
  "products/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews?id=${productId}`);
      return data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "products/deleteReview",
  async ({ reviewId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/admin/reviews?id=${reviewId}&productId=${productId}`,
        { withCredentials: true },
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    // 🏪 All Products State (for product listing pages)
    products: [],
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
    loading: false,
    error: null,

    // 🔍 Single Product State (for product detail page)
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

    /**
     * 🧹 Clear Product Status
     * Used after delete/update operations
     * Resets success flags so they don't trigger again
     */
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
      // ✅ FULFILLED: Request succeeded
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount = action.payload.filteredProductsCount;
        state.error = null;
      })
      // ❌ REJECTED: Request failed
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
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
        state.adminError = action.payload || "Failed to fetch admin products";
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
        state.error = action.payload || "Failed to create product";
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
        state.error = action.payload || "Failed to update product";
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
        state.error = action.payload || "Failed to delete product";
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
          action.payload || "Failed to fetch product details";
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
        state.reviewError = action.payload || "Failed to create review";
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
        state.reviewsError = action.payload || "Failed to fetch reviews";
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
        state.error = action.payload || "Failed to delete review";
      });
  },
});

export const {
  clearErrors,
  clearProductStatus,
  resetProduct,
  resetReviewState,
} = productSlice.actions;

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
export default productSlice.reducer;
