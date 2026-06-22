import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    settings: settingsReducer,
  },
});

export default store;
