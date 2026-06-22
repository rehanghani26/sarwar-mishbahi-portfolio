import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Check if token exists in local storage
const token = localStorage.getItem('adminToken');
const adminInfo = localStorage.getItem('adminInfo')
  ? JSON.parse(localStorage.getItem('adminInfo') || '{}')
  : null;

const initialState = {
  adminInfo: adminInfo,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await API.post('/auth/login', { username, password });
      
      // Save details to local storage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      // Token is expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      return thunkAPI.rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      state.adminInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInfo = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.adminInfo = { ...state.adminInfo, ...action.payload };
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.adminInfo = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
