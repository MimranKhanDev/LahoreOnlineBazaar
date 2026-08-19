// src/features/orders/orderSlice.js

/**
 * 📋 ORDER SLICE - Manages orders and order details
 *
 * This file replaces THREE files from old Redux:
 * 1. constants/orderConstants.js
 * 2. actions/orderAction.js
 * 3. reducers/orderReducer.js
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/v1";

/**
 * 📝 Create New Order
 */
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData) => {
    const { data } = await axios.post(`${API_URL}/order/new`, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return data; // Returns order data
  },
);

/**
 * 📋 Get My Orders (User)
 */
export const getMyOrders = createAsyncThunk("orders/getMyOrders", async () => {
  const { data } = await axios.get(`${API_URL}/orders/me`);
  return data.orders;
});

/**
 📋 Get All Orders (Admin)
 */
export const getAllOrders = createAsyncThunk("orders/getAll", async () => {
  const { data } = await axios.get(`${API_URL}/admin/orders`);
  return data.orders;
});

/**
 * 🔍 Get Order Details
 */
export const getOrderDetails = createAsyncThunk(
  "orders/getDetails",
  async (id) => {
    const { data } = await axios.get(`${API_URL}/order/${id}`);
    return data.order;
  },
);

/**
 * ✏️ Update Order Status (Admin)
 */
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, orderData }) => {
    const { data } = await axios.put(
      `${API_URL}/admin/order/${id}`,
      orderData,
      { headers: { "Content-Type": "application/json" } },
    );
    return data.success;
  },
);

/**
 * 🗑️ Delete Order (Admin)
 */
export const deleteOrder = createAsyncThunk("orders/delete", async (id) => {
  const { data } = await axios.delete(`${API_URL}/admin/order/${id}`);
  return data.success;
});

/**
 * 🎨 Order Slice
 */
const orderSlice = createSlice({
  name: "orders",

  initialState: {
    // 📝 New Order
    order: null,
    orderLoading: false,
    orderError: null,

    // 📋 My Orders
    myOrders: [],
    myOrdersLoading: false,
    myOrdersError: null,

    // 📋 All Orders (Admin)
    allOrders: [],
    allOrdersLoading: false,
    allOrdersError: null,

    // 🔍 Order Details
    orderDetails: null,
    orderDetailsLoading: false,
    orderDetailsError: null,

    // ✏️ Update/Delete Status
    isUpdated: false,
    isDeleted: false,
  },

  reducers: {
    clearOrderErrors: (state) => {
      state.orderError = null;
      state.myOrdersError = null;
      state.allOrdersError = null;
      state.orderDetailsError = null;
    },
    clearOrderStatus: (state) => {
      state.isUpdated = false;
      state.isDeleted = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ============= CREATE ORDER =============
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.order = action.payload;
        state.orderError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.error.message || "Failed to create order";
      })

      // ============= GET MY ORDERS =============
      .addCase(getMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrders = action.payload;
        state.myOrdersError = null;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersError = action.error.message || "Failed to fetch orders";
      })

      // ============= GET ALL ORDERS (Admin) =============
      .addCase(getAllOrders.pending, (state) => {
        state.allOrdersLoading = true;
        state.allOrdersError = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrders = action.payload;
        state.allOrdersError = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrdersError =
          action.error.message || "Failed to fetch all orders";
      })

      // ============= GET ORDER DETAILS =============
      .addCase(getOrderDetails.pending, (state) => {
        state.orderDetailsLoading = true;
        state.orderDetailsError = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetails = action.payload;
        state.orderDetailsError = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetailsError =
          action.error.message || "Failed to fetch order details";
      })

      // ============= UPDATE ORDER STATUS =============
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.isUpdated = false;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.error.message || "Failed to update order";
      })

      // ============= DELETE ORDER =============
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.isDeleted = false;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.isDeleted = false;
        state.error = action.error.message || "Failed to delete order";
      });
  },
});

/**
 * 📤 EXPORT SYNC ACTIONS
 */
export const { clearOrderErrors, clearOrderStatus } = orderSlice.actions;

/**
 * 📤 EXPORT SELECTORS
 */
export const selectMyOrders = (state) => state.orders.myOrders;
export const selectOrderDetails = (state) => state.orders.orderDetails;

/**
 * 📤 EXPORT REDUCER
 */
export default orderSlice.reducer;
