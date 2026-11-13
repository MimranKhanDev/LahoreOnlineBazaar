import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/v1";

// ============= ASYNC THUNKS =============

export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/order/new`, orderData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const getMyOrders = createAsyncThunk(
  "orders/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/me`, {
        withCredentials: true,
      });
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const getAllOrders = createAsyncThunk(
  "orders/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/orders`, {
        withCredentials: true,
      });
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const getOrderDetails = createAsyncThunk(
  "orders/getDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/order/${id}`, {
        withCredentials: true,
      });
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/admin/order/${id}`,
        orderData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/admin/order/${id}`, {
        withCredentials: true,
      });
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const getSales = createAsyncThunk(
  "orders/getSales",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/get_sales`, {
        withCredentials: true,
      });
      return data; // Returns { totalSales, totalNumOrders, sales }
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);
// ============= SLICE =============

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    order: null,
    orderLoading: false,
    orderError: null,

    myOrders: [],
    myOrdersLoading: false,
    myOrdersError: null,

    allOrders: [],
    allOrdersLoading: false,
    allOrdersError: null,

    orderDetails: null,
    orderDetailsLoading: false,
    orderDetailsError: null,

    sales: [],

    loading: false,
    error: null,

    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
    clearOrderErrors: (state) => {
      state.orderError = null;
      state.myOrdersError = null;
      state.allOrdersError = null;
      state.orderDetailsError = null;
      state.error = null; // ✅ Clear generic error
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
        state.orderError = action.payload || "Failed to create order"; // ✅ Fixed
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
        state.myOrdersError = action.payload || "Failed to fetch orders"; // ✅ Fixed
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
        state.allOrdersError = action.payload || "Failed to fetch all orders"; // ✅ Fixed
      })

      // ============= GET SALES =============
      .addCase(getSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.sales;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
          action.payload || "Failed to fetch order details"; // ✅ Fixed
      })

      // ============= UPDATE ORDER STATUS =============
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true; // ✅ Now exists in initialState
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
        state.error = action.payload || "Failed to update order"; // ✅ Fixed
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
        state.error = action.payload || "Failed to delete order"; // ✅ Fixed
      });
  },
});

export const { clearOrderErrors, clearOrderStatus } = orderSlice.actions;

export const selectMyOrders = (state) => state.orders.myOrders;
export const selectOrderDetails = (state) => state.orders.orderDetails;
export const selectMyOrdersLoading = (state) => state.orders.myOrdersLoading;
export const selectMyOrdersError = (state) => state.orders.myOrdersError;
export const selectAllOrders = (state) => state.orders.allOrders;
export const selectAllOrdersLoading = (state) => state.orders.allOrdersLoading;
export const selectAllOrdersError = (state) => state.orders.allOrdersError;
export const selectOrderDetailsLoading = (state) =>
  state.orders.orderDetailsLoading;

export const selectSales = (state) => state.orders.sales;

export const selectOrderDetailsError = (state) =>
  state.orders.orderDetailsError;

export default orderSlice.reducer;
