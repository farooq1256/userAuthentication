import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from "@/components/path";
import { GlobalApiCall } from "../GlobalApiCall";

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true", 
  isLoading: false,
  user: JSON.parse(localStorage.getItem("userInfo")) || null, 
  error: null,
};

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await GlobalApiCall(
        `${URL.baseURL}/auth/register`, 
        'POST',
        formData,
        null, 
        null, 
        "application/json",
        true 
      );
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await GlobalApiCall(
        `${URL.baseURL}/auth/login`, 
        'POST',
        formData,
        null, 
        null, 
        "application/json",
        true 
      );

      const { token, user } = response

      // Store token and user in localStorage
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", true); 
      }

      return response
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data || error.message); 
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${URL.baseURL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // Clear localStorage on logout
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      localStorage.setItem("isAuthenticated", false);
      return response.data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Check Authentication
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${URL.baseURL}/auth/check-auth`,
        {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      // If the server confirms the user is authenticated, update localStorage
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));

      return response.data; // Return the response data
    } catch (error) {
      // If the user is not authenticated, clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      localStorage.setItem("isAuthenticated", false);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Synchronously set user data
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user; // Set user data from the response
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set error message
      })

      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user; // Set user data from the response
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set error message
      })

      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false; // Reset authentication state
        state.user = null; // Clear user data
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set error message
      })

      // Check Authentication Cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true; // Set authentication state
        state.user = action.payload.user; // Set user data from the response
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false; // Reset authentication state
        state.user = null; // Clear user data
        state.error = action.payload; // Set error message
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;