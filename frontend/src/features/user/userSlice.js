import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/v1";

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        withCredentials: true,
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  await axios.get(`${API_URL}/logout`, { withCredentials: true });
  return null;
});

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/me/update`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/password/update`,
        passwords,
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

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/password/forgot`,
        { email },
        { headers: { "Content-Type": "application/json" } },
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, passwords }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/password/reset/${token}`,
        passwords,
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

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/users`, {
        withCredentials: true,
      });
      return data.users;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const getUserDetails = createAsyncThunk(
  "user/getUserDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/user/${id}`, {
        withCredentials: true,
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/admin/user/${id}`,
        userData,
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

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/admin/user/${id}`, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    isUpdated: false,
    isDeleted: false,
    users: [],
    userDetails: null, // ✅ CRUCIAL FIX
    userDetailsLoading: false, // ✅ CRUCIAL FIX
    allUsersLoading: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.message = null;
      state.isUpdated = false;
      state.isDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload || "Login failed";
      })
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
        state.error = action.payload || "Registration failed";
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
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
        state.error = action.payload || "Profile update failed";
      })
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
        state.error = action.payload || "Password update failed";
      })
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
        state.error = action.payload || "Forgot password failed";
      })
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
        state.error = action.payload || "Reset password failed";
      })

      .addCase(getAllUsers.pending, (state) => {
        state.allUsersLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsersLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.allUsersLoading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      // ✅ FIXED: These now use userDetailsLoading, protecting the main 'loading' state
      .addCase(getUserDetails.pending, (state) => {
        state.userDetailsLoading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetails = action.payload;
        state.error = null;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.error = action.payload || "Failed to fetch user";
      })

      .addCase(updateUser.pending, (state) => {
        state.userDetailsLoading = true;
        state.isUpdated = false;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.userDetailsLoading = false;
        state.isUpdated = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.isUpdated = false;
        state.error = action.payload || "User update failed";
      })

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
        state.error = action.payload || "User deletion failed";
      });
  },
});

export const { clearErrors, clearMessages } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectAllUsers = (state) => state.user.users;

export default userSlice.reducer;
