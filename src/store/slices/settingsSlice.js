import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const initialState = {
  settings: {
    language: localStorage.getItem('site_language') || 'English',
    englishFont: localStorage.getItem('site_english_font') || 'Inter',
    urduFont: localStorage.getItem('site_urdu_font') || 'Noto Nastaliq Urdu',
  },
  stats: null,
  loading: false,
  isSettingsLoaded: false,
  statsLoading: false,
  error: null,
  updateSuccess: false,
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/settings');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, thunkAPI) => {
    try {
      const { data } = await API.put('/settings', settingsData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchStats = createAsyncThunk(
  'settings/fetchStats',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/settings/stats');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsErrors: (state) => {
      state.error = null;
      state.updateSuccess = false;
    },
    setLocalLanguage: (state, action) => {
      if (!state.settings) state.settings = {};
      state.settings.language = action.payload;
    },
    setLocalEnglishFont: (state, action) => {
      if (!state.settings) state.settings = {};
      state.settings.englishFont = action.payload;
    },
    setLocalUrduFont: (state, action) => {
      if (!state.settings) state.settings = {};
      state.settings.urduFont = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.isSettingsLoaded = true;
        state.settings = {
          ...action.payload,
          language: localStorage.getItem('site_language') || action.payload?.language || 'English',
          englishFont: localStorage.getItem('site_english_font') || action.payload?.englishFont || 'Inter',
          urduFont: localStorage.getItem('site_urdu_font') || action.payload?.urduFont || 'Noto Nastaliq Urdu',
        };
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.isSettingsLoaded = false;
        state.error = action.payload || 'Server is under maintenance';
      })
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = {
          ...action.payload,
          language: localStorage.getItem('site_language') || action.payload?.language || 'English',
          englishFont: localStorage.getItem('site_english_font') || action.payload?.englishFont || 'Inter',
          urduFont: localStorage.getItem('site_urdu_font') || action.payload?.urduFont || 'Noto Nastaliq Urdu',
        };
        state.updateSuccess = true;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettingsErrors, setLocalLanguage, setLocalEnglishFont, setLocalUrduFont } = settingsSlice.actions;
export default settingsSlice.reducer;
