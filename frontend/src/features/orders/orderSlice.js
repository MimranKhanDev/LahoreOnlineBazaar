// src/features/orders/orderSlice.js

/**
 * 📋 ORDER SLICE - Manages orders and order details
 *
 * This is like the "Orders Department" in our warehouse
 * It handles:
 * 1. Creating new orders (checkout)
 * 2. Fetching user's orders (My Orders page)
 * 3. Fetching all orders (Admin)
 * 4. Updating order status (Admin)
 * 5. Deleting orders (Admin)
 *
 * 🔄 REPLACES 3 OLD FILES:
 * - constants/orderConstants.js
 * - actions/orderAction.js
 * - reducers/orderReducer.js
 *
 * 🌟 KEY CONCEPT: Multiple Async Thunks
 *    This slice has 5 different async operations
 *    Each one handles a different order-related API call
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⚙️ API Base URL
const API_URL = "/api/v1";

/**
 * 📝 Create New Order
 *
 * 🎯 When to use: After successful payment
 *
 * 📥 Parameters: orderData (shipping info, items, total, payment info)
 *
 * 📤 Returns: Created order data
 *
 * ❓ Why is this important?
 *    This is the final step of checkout!
 *    It saves the order to the database
 */
export const createOrder = createAsyncThunk(
  // 📛 Action type: 'orders/create'
  "orders/create",

  // 🔧 The API call
  async (orderData) => {
    const { data } = await axios.post(`${API_URL}/order/new`, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return data; // Returns order data
  },
);

/**
 * 📋 Get My Orders (User)
 *
 * 🎯 When to use: "My Orders" page
 *
 * 📤 Returns: Array of user's orders
 *
 * 🔐 Authentication: Requires user to be logged in
 *    The backend uses cookies/session to identify the user
 */
export const getMyOrders = createAsyncThunk("orders/getMyOrders", async () => {
  const { data } = await axios.get(`${API_URL}/orders/me`);
  return data.orders;
});

/**
 📋 Get All Orders (Admin)
 * 
 * 🎯 When to use: Admin "All Orders" page
 * 
 * 📤 Returns: Array of all orders (all users)
 * 
 * 🔐 Authentication: Requires admin role
 *    Backend checks user role before returning data
 */
export const getAllOrders = createAsyncThunk("orders/getAll", async () => {
  const { data } = await axios.get(`${API_URL}/admin/orders`);
  return data.orders;
});

/**
 * 🔍 Get Order Details
 *
 * 🎯 When to use: Order Details page (view specific order)
 *
 * 📥 Parameters: id - Order ID
 *
 * 📤 Returns: Single order object with all details
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
 *
 * 🎯 When to use: Admin "Process Order" page
 *
 * 📥 Parameters:
 *    - id: Order ID
 *    - orderData: { status: "Shipped" | "Delivered" | "Cancelled" }
 *
 * 📤 Returns: success (boolean)
 *
 * 🔐 Authentication: Requires admin role
 *
 * ❓ Why is this important?
 *    This is how admins update order status
 *    Example: Processing → Shipped → Delivered
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
 *
 * 🎯 When to use: Admin "All Orders" page (delete button)
 *
 * 📥 Parameters: id - Order ID
 *
 * 📤 Returns: success (boolean)
 *
 * 🔐 Authentication: Requires admin role
 */
export const deleteOrder = createAsyncThunk("orders/delete", async (id) => {
  const { data } = await axios.delete(`${API_URL}/admin/order/${id}`);
  return data.success;
});

/**
 * 🎨 Create Order Slice
 *
 * This slice manages ALL order-related state
 * Different parts of the app use different order data:
 * - User: My orders
 * - Admin: All orders, process orders
 * - Checkout: Create order
 * - Order Details: Single order
 */
const orderSlice = createSlice({
  name: "orders",

  /**
   * 🏪 Initial State - All order-related data
   *
   * Each "bin" holds different order data:
   * - order: Newly created order
   * - myOrders: User's orders
   * - allOrders: All orders (admin)
   * - orderDetails: Single order details
   * - isUpdated/isDeleted: Status flags
   */
  initialState: {
    // 📝 New Order
    order: null, // Created order data
    orderLoading: false, // Is order being created?
    orderError: null, // Order creation error

    // 📋 My Orders
    myOrders: [], // User's orders array
    myOrdersLoading: false, // Are my orders loading?
    myOrdersError: null, // My orders error

    // 📋 All Orders (Admin)
    allOrders: [], // All orders array
    allOrdersLoading: false, // Are all orders loading?
    allOrdersError: null, // All orders error

    // 🔍 Order Details
    orderDetails: null, // Single order object
    orderDetailsLoading: false, // Is order details loading?
    orderDetailsError: null, // Order details error

    // ✏️ Update/Delete Status
    isUpdated: false, // Was order updated?
    isDeleted: false, // Was order deleted?
  },

  /**
   * 🔄 Synchronous Reducers
   *
   * These handle actions that don't need API calls
   * Mostly clearing errors and resetting status flags
   */
  reducers: {
    /**
     * 🧹 Clear Order Errors
     *
     * Resets all order-related errors
     * Called after showing error messages
     */
    clearOrderErrors: (state) => {
      state.orderError = null;
      state.myOrdersError = null;
      state.allOrdersError = null;
      state.orderDetailsError = null;
    },

    /**
     * 🧹 Clear Order Status
     *
     * Resets update/delete status flags
     * Called after success messages are shown
     */
    clearOrderStatus: (state) => {
      state.isUpdated = false;
      state.isDeleted = false;
    },
  },

  /**
   * ⚡ Async Reducers (extraReducers)
   *
   * Handles the 3 states (pending, fulfilled, rejected) for each async action
   *
   * 🎯 Pattern: For each thunk, we handle:
   *    - PENDING: Set loading = true
   *    - FULFILLED: Set loading = false, store data
   *    - REJECTED: Set loading = false, store error
   */
  extraReducers: (builder) => {
    builder
      // ============= CREATE ORDER =============
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true; // Show loading
        state.orderError = null; // Clear previous error
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderLoading = false; // Hide loading
        state.order = action.payload; // Store created order
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
        state.myOrders = action.payload; // Store user's orders
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
        state.allOrders = action.payload; // Store all orders
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
        state.orderDetails = action.payload; // Store order details
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
        state.isUpdated = true; // Flag for success
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
        state.isDeleted = true; // Flag for success
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
 * 📤 Export Sync Actions
 */
export const { clearOrderErrors, clearOrderStatus } = orderSlice.actions;

/**
 * 📤 Export Selectors
 *
 * These "receptionists" get specific order data
 *
 * ❓ Why only 2 selectors?
 *    We export what components need:
 *    - My Orders page needs myOrders
 *    - Order Details page needs orderDetails
 *    - Other components can access via state.orders.xxx
 */
export const selectMyOrders = (state) => state.orders.myOrders;
export const selectOrderDetails = (state) => state.orders.orderDetails;
export const selectMyOrdersLoading = (state) => state.orders.myOrdersLoading;
export const selectMyOrdersError = (state) => state.orders.myOrdersError;
export const selectAllOrders = (state) => state.orders.allOrders;
export const selectAllOrdersLoading = (state) => state.orders.allOrdersLoading;
export const selectAllOrdersError = (state) => state.orders.allOrdersError;
export const selectOrderDetailsLoading = (state) =>
  state.orders.orderDetailsLoading;
export const selectOrderDetailsError = (state) =>
  state.orders.orderDetailsError;

/**
 * 📤 Export Reducer
 */
export default orderSlice.reducer;
