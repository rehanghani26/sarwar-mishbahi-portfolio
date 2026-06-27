import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, checkAuthStatus as checkAuthStatusApi } from '@/services';

// Check if token exists in local storage
const token = localStorage.getItem('adminToken');
const adminInfo = localStorage.getItem('adminInfo')
  ? JSON.parse(localStorage.getItem('adminInfo') || '{}')
  : null;

const initialState = {
  loggedInUser: adminInfo,
  token: token,
  userRole: adminInfo ? 'admin' : null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const data = await loginUser({ username, password });
      
      // Save details to local storage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      
      return data;
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
      const data = await checkAuthStatusApi();
      return data;
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
      state.loggedInUser = null;
      state.token = null;
      state.userRole = null;
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
        state.loggedInUser = action.payload;
        state.token = action.payload.token;
        state.userRole = 'admin';
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loggedInUser = { ...state.loggedInUser, ...action.payload };
        state.userRole = 'admin';
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loggedInUser = null;
        state.token = null;
        state.userRole = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
