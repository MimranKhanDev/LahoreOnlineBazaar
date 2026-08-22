// src/features/user/userSlice.js

/**
 * 👤 USER SLICE - Manages user authentication & profile
 *
 * This is like the "User Department" in our warehouse
 * It handles:
 * 1. User login/logout
 * 2. User registration
 * 3. Profile updates
 * 4. Password management
 * 5. Admin user management
 *
 * 🔄 REPLACES 3 OLD FILES:
 * - constants/userConstants.js
 * - actions/userAction.js
 * - reducers/userReducer.js
 *
 * 🌟 KEY CONCEPT: Authentication Flow
 *    1. User logs in → Store user data → isAuthenticated = true
 *    2. App loads → Check if user is logged in → Load user data
 *    3. User logs out → Clear user data → isAuthenticated = false
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⚙️ API Base URL
const API_URL = "/api/v1";

/**
 * 🔐 ASYNC THUNK: Login User
 *
 * 🎯 When to use: Login form submission
 *
 * 📥 Parameters: { email, password }
 *
 * 📤 Returns: User data (name, email, avatar, role, etc.)
 *
 * 🌟 HOW createAsyncThunk WORKS:
 *
 * When we call dispatch(loginUser({ email, password })):
 *
 * 1. 💫 PENDING:
 *    - Dispatches 'user/login/pending'
 *    - Sets loading = true
 *
 * 2. ✅ FULFILLED:
 *    - Dispatches 'user/login/fulfilled'
 *    - Sets loading = false, isAuthenticated = true
 *    - Stores user data
 *
 * 3. ❌ REJECTED:
 *    - Dispatches 'user/login/rejected'
 *    - Sets loading = false, isAuthenticated = false
 *    - Stores error message
 *
 * All 3 states are handled in extraReducers below!
 */
export const loginUser = createAsyncThunk(
  "user/login", // Action type prefix: 'user/login/pending', 'user/login/fulfilled', etc.
  async ({ email, password }) => {
    // 📤 Make API request
    const { data } = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } },
    );
    return data.user; // This becomes action.payload in fulfilled state
  },
);

/**
 * 📝 ASYNC THUNK: Register User
 *
 * 🎯 When to use: Registration form submission
 *
 * 📥 Parameters: userData (name, email, password, avatar)
 *
 * 📤 Returns: User data
 *
 * 🌟 Multipart/form-data:
 *    We use this for file upload (avatar)
 *    It allows sending files and text together
 *    Regular JSON can't handle files
 */
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData) => {
    const { data } = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return data.user;
  },
);

/**
 * 👤 ASYNC THUNK: Load Current User
 *
 * 🎯 When to use: App startup, after login, after profile update
 *
 * 📤 Returns: Current user data
 *
 * 🌟 WHY IS THIS IMPORTANT?
 *    - Checks if user is logged in (via cookie/session)
 *    - Loads user data for the whole app
 *    - Runs when app starts (in App.jsx useEffect)
 *
 * ❓ What if user is not logged in?
 *    - The API will return an error (401 Unauthorized)
 *    - We handle it in rejected state (isAuthenticated = false)
 *    - But we DON'T show an error (it's normal for guest users)
 */
export const loadUser = createAsyncThunk("user/loadUser", async () => {
  const { data } = await axios.get(`${API_URL}/me`);
  return data.user;
});

/**
 * 🚪 ASYNC THUNK: Logout User
 *
 * 🎯 When to use: User clicks logout button
 *
 * 📤 Returns: null (clears user data)
 *
 * ❓ Why no payload?
 *    We just need to clear the user state
 *    The actual logout happens on the server (clears cookie)
 */
export const logoutUser = createAsyncThunk("user/logout", async () => {
  await axios.get(`${API_URL}/logout`);
  return null; // No payload needed, just clear user
});

/**
 * ✏️ ASYNC THUNK: Update Profile
 *
 * 🎯 When to use: User updates profile (name, avatar)
 *
 * 📥 Parameters: userData (name, avatar)
 *
 * 📤 Returns: success (boolean)
 *
 * 🌟 Multipart/form-data: For avatar upload
 */
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData) => {
    const { data } = await axios.put(`${API_URL}/me/update`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return data.success;
  },
);

/**
 * 🔑 ASYNC THUNK: Update Password
 *
 * 🎯 When to use: User changes password
 *
 * 📥 Parameters: passwords { oldPassword, newPassword, confirmPassword }
 *
 * 📤 Returns: success (boolean)
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
 *
 * 🎯 When to use: User clicks "Forgot Password"
 *
 * 📥 Parameters: email
 *
 * 📤 Returns: message (success message)
 *
 * 🌟 Flow:
 *    1. User enters email
 *    2. Server sends reset link to email
 *    3. User clicks link (goes to reset password page)
 *    4. User enters new password (resetPassword thunk)
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
 *
 * 🎯 When to use: User clicks password reset link in email
 *
 * 📥 Parameters:
 *    - token: Reset token from email link
 *    - passwords: { password, confirmPassword }
 *
 * 📤 Returns: success (boolean)
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
 *
 * 🎯 When to use: Admin "All Users" page
 *
 * 📤 Returns: Array of all users
 *
 * 🔐 Authentication: Requires admin role
 */
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const { data } = await axios.get(`${API_URL}/admin/users`);
  return data.users;
});

/**
 * 🔍 ASYNC THUNK: Get User Details (Admin Only)
 *
 * 🎯 When to use: Admin "Update User" page
 *
 * 📥 Parameters: id - User ID
 *
 * 📤 Returns: Single user object
 *
 * 🔐 Authentication: Requires admin role
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
 *
 * 🎯 When to use: Admin updates user (name, email, role)
 *
 * 📥 Parameters:
 *    - id: User ID
 *    - userData: { name, email, role }
 *
 * 📤 Returns: success (boolean)
 *
 * 🔐 Authentication: Requires admin role
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
 *
 * 🎯 When to use: Admin deletes user
 *
 * 📥 Parameters: id - User ID
 *
 * 📤 Returns: { success, message }
 *
 * 🔐 Authentication: Requires admin role
 */
export const deleteUser = createAsyncThunk("user/deleteUser", async (id) => {
  const { data } = await axios.delete(`${API_URL}/admin/user/${id}`);
  return data;
});

/**
 * 🎨 Create User Slice
 *
 * This is the biggest slice because user management has many operations
 * It manages:
 * - Authentication state (isAuthenticated, user)
 * - Loading states for each operation
 * - Error states for each operation
 * - Success flags (isUpdated, isDeleted)
 */
const userSlice = createSlice({
  name: "user",

  /**
   * 🏪 Initial State
   *
   * 🌟 IMPORTANT FIELDS:
   *    - user: The actual user data (null if not logged in)
   *    - isAuthenticated: Boolean (true if logged in)
   *    - loading: Loading indicator
   *    - error: Error message (if any)
   *    - message: Success message (for password reset, etc.)
   *    - isUpdated: Profile/password update success flag
   *    - isDeleted: Delete user success flag
   *    - users: All users (for admin)
   */
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    isUpdated: false,
    isDeleted: false,
    users: [],
  },

  /**
   * 🔄 Synchronous Reducers
   *
   * These are actions we dispatch directly
   * No API calls needed
   */
  reducers: {
    /**
     * 🧹 Clear Errors
     *
     * Called after showing error messages
     * Prevents old errors from persisting
     */
    clearErrors: (state) => {
      state.error = null;
    },

    /**
     * 🧹 Clear Messages
     *
     * Called after showing success messages
     * Prevents old success messages from persisting
     */
    clearMessages: (state) => {
      state.message = null;
      state.isUpdated = false;
      state.isDeleted = false;
    },
  },

  /**
   * ⚡ Async Reducers (extraReducers)
   *
   * Handles ALL async operations in one place
   * Each operation follows the same pattern:
   *    PENDING → Set loading = true
   *    FULFILLED → Set loading = false, store data/success
   *    REJECTED → Set loading = false, store error
   */
  extraReducers: (builder) => {
    builder
      // ============= LOGIN =============
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; // ✅ User is logged in
        state.user = action.payload; // Store user data
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
        state.isAuthenticated = true; // ✅ Auto-login after registration
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
        state.isAuthenticated = true; // ✅ User is logged in
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false; // ❌ Not logged in
        state.user = null;
        // ⚠️ No error set - this is normal for guest users
      })

      // ============= LOGOUT =============
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false; // ❌ Logged out
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
        state.isUpdated = true; // ✅ Success flag
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
        state.isUpdated = true; // ✅ Success flag
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
        state.message = action.payload; // ✅ Success message
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
        state.isUpdated = true; // ✅ Success flag
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
        state.users = action.payload; // ✅ Store all users
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
        state.user = action.payload; // ✅ Store user details
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
        state.isUpdated = true; // ✅ Success flag
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
        state.isDeleted = true; // ✅ Success flag
        state.message = action.payload.message; // ✅ Success message
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
 * 📤 Export Sync Actions
 */
export const { clearErrors, clearMessages } = userSlice.actions;

/**
 * 📤 Export Selectors
 *
 * These "receptionists" get user-related data
 *
 * ❓ Why these specific selectors?
 *    Components need:
 *    - User data (for profile, header)
 *    - Authentication status (for protected routes)
 *    - Loading state (for showing spinners)
 *    - Error state (for showing errors)
 */
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectAllUsers = (state) => state.user.users;

/**
 * 📤 Export Reducer
 */
export default userSlice.reducer;
