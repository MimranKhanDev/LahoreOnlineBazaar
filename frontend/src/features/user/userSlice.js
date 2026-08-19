// src/features/user/userSlice.js

/**
 * 👤 USER SLICE - Manages user authentication & profile
 *
 * This file replaces THREE files from old Redux:
 * 1. constants/userConstants.js
 * 2. actions/userAction.js
 * 3. reducers/userReducer.js
 *
 * KEY CONCEPT: We use createAsyncThunk for API calls
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⚙️ Configure axios base URL
// This assumes your backend API is at /api/v1
// If running on different port, adjust accordingly
const API_URL = "/api/v1";

/**
 * 🔐 ASYNC THUNK: Login User
 *
 * createAsyncThunk handles the lifecycle of an async action:
 * 1. PENDING: When the request starts
 * 2. FULFILLED: When the request succeeds
 * 3. REJECTED: When the request fails
 *
 * @param {Object} credentials - { email, password }
 * @returns {Object} User data
 */
export const loginUser = createAsyncThunk(
  "user/login", // Action type prefix
  async ({ email, password }) => {
    // 📤 Make API request
    const { data } = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } },
    );
    return data.user; // This becomes the payload
  },
);

/**
 * 📝 ASYNC THUNK: Register User
 */
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData) => {
    // ✅ Multipart/form-data for file upload (avatar)
    const { data } = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.user;
  },
);

/**
 * 👤 ASYNC THUNK: Load Current User
 *
 * This runs when the app starts to check if user is logged in
 */
export const loadUser = createAsyncThunk("user/loadUser", async () => {
  const { data } = await axios.get(`${API_URL}/me`);
  return data.user;
});

/**
 * 🚪 ASYNC THUNK: Logout User
 */
export const logoutUser = createAsyncThunk("user/logout", async () => {
  await axios.get(`${API_URL}/logout`);
  return null; // No payload needed
});

/**
 * ✏️ ASYNC THUNK: Update Profile
 */
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData) => {
    const { data } = await axios.put(`${API_URL}/me/update`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.success;
  },
);

/**
 * 🔑 ASYNC THUNK: Update Password
 */
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwords) => {
    const { data } = await axios.put(`${API_URL}/password/update`, passwords, {
      headers: { "Content-Type": "application/json" },
    });
    return data.success;
  },
);

/**
 * 📧 ASYNC THUNK: Forgot Password
 */
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email) => {
    const { data } = await axios.post(
      `${API_URL}/password/forgot`,
      { email },
      { headers: { "Content-Type": "application/json" } },
    );
    return data.message;
  },
);

/**
 * 🔄 ASYNC THUNK: Reset Password
 */
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, passwords }) => {
    const { data } = await axios.put(
      `${API_URL}/password/reset/${token}`,
      passwords,
      { headers: { "Content-Type": "application/json" } },
    );
    return data.success;
  },
);

/**
 * 👥 ASYNC THUNK: Get All Users (Admin Only)
 */
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const { data } = await axios.get(`${API_URL}/admin/users`);
  return data.users;
});

/**
 * 🔍 ASYNC THUNK: Get User Details (Admin Only)
 */
export const getUserDetails = createAsyncThunk(
  "user/getUserDetails",
  async (id) => {
    const { data } = await axios.get(`${API_URL}/admin/user/${id}`);
    return data.user;
  },
);

/**
 * ✏️ ASYNC THUNK: Update User (Admin Only)
 */
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }) => {
    const { data } = await axios.put(`${API_URL}/admin/user/${id}`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return data.success;
  },
);

/**
 * 🗑️ ASYNC THUNK: Delete User (Admin Only)
 */
export const deleteUser = createAsyncThunk("user/deleteUser", async (id) => {
  const { data } = await axios.delete(`${API_URL}/admin/user/${id}`);
  return data;
});

/**
 * 🎨 Create User Slice
 *
 * The slice manages:
 * 1. Sync actions (like clearing errors)
 * 2. Async actions (from thunks above)
 */
const userSlice = createSlice({
  name: "user",

  // 🏪 Initial State
  initialState: {
    user: null, // User object or null
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null, // For success messages
    isUpdated: false, // For profile/password updates
    isDeleted: false, // For admin delete
    users: [], // For admin user list
  },

  // 🔄 Synchronous Reducers (for actions that don't need API)
  reducers: {
    /**
     * Clear all errors
     */
    clearErrors: (state) => {
      state.error = null;
    },

    /**
     * Clear success messages
     */
    clearMessages: (state) => {
      state.message = null;
      state.isUpdated = false;
      state.isDeleted = false;
    },
  },

  // ⚡ Async Reducers (handles the thunk actions)
  extraReducers: (builder) => {
    builder
      // ============= LOGIN =============
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message || "Login failed";
      })

      // ============= REGISTER =============
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message || "Registration failed";
      })

      // ============= LOAD USER =============
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        // Don't set error here - it's okay if user isn't logged in
      })

      // ============= LOGOUT =============
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })

      // ============= UPDATE PROFILE =============
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.isUpdated = false;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.error.message || "Profile update failed";
      })

      // ============= UPDATE PASSWORD =============
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.isUpdated = false;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.error.message || "Password update failed";
      })

      // ============= FORGOT PASSWORD =============
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Forgot password failed";
      })

      // ============= RESET PASSWORD =============
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUpdated = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.error.message || "Reset password failed";
      })

      // ============= GET ALL USERS (Admin) =============
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // ============= GET USER DETAILS (Admin) =============
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })

      // ============= UPDATE USER (Admin) =============
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.isUpdated = false;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.error.message || "User update failed";
      })

      // ============= DELETE USER (Admin) =============
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.isDeleted = false;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.isDeleted = false;
        state.error = action.error.message || "User deletion failed";
      });
  },
});

/**
 * 📤 EXPORT SYNC ACTIONS
 */
export const { clearErrors, clearMessages } = userSlice.actions;

/**
 * 📤 EXPORT SELECTORS
 */
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

/**
 * 📤 EXPORT REDUCER
 */
export default userSlice.reducer;
