import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  return (
    <Provider store={store}>
      <SettingsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SettingsProvider>
    </Provider>
  );
}
