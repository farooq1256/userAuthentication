import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state setup with localStorage
const initialState = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  isLoading: false,
  user: JSON.parse(localStorage.getItem("user")) || null,
};

// Thunk for registering a user
export const registerUser = createAsyncThunk("auth/register", async (formData) => {
  const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
    withCredentials: true,
  });
  return response.data;
});

// Thunk for logging in a user
export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
    withCredentials: true,
  });
  return response.data;
});

// Thunk for logging out a user
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post("http://localhost:5000/api/auth/logout", {}, {
    withCredentials: true,
  });
  return response.data;
});

// Thunk to check authentication status
export const checkAuth = createAsyncThunk("auth/checkauth", async () => {
  const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle register user cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      // Handle login user cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("isAuthenticated", JSON.stringify(true));
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Handle checkAuth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("isAuthenticated", JSON.stringify(true));
        } else {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      })
      // Handle logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      });
  },
});

export default authSlice.reducer;
