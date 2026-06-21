import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSettings } from '../store/slices/settingsSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const fontFamilies = {
  'Inter': "'Inter', sans-serif",
  'Roboto': "'Roboto', sans-serif",
  'Playfair Display': "'Playfair Display', serif",
  'Lora': "'Lora', serif",
  'Outfit': "'Outfit', sans-serif",
};

export default function MainLayout() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { settings, loading, error, isSettingsLoaded } = useSelector((state) => state.settings);

  const englishFont = settings?.englishFont || 'Inter';

  // Scroll to top automatically when navigation path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Fetch settings globally on load
  useEffect(() => {
    if (!isSettingsLoaded && !loading && !error) {
      dispatch(fetchSettings());
    }
  }, [dispatch, isSettingsLoaded, loading, error]);

  // Apply typography and direction configuration dynamically
  useEffect(() => {
    const mappedFont = fontFamilies[englishFont] || fontFamilies['Inter'];
    
    document.body.style.fontFamily = mappedFont;
    document.body.dir = 'ltr';
  }, [englishFont]);

  // If initial API call is in progress, show spinner/loader
  if (loading || (!isSettingsLoaded && !error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF7F2] text-[#1F3A5F]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B08D57]"></div>
        <p className="mt-4 text-sm font-semibold font-serif tracking-wider text-[#7B654D] uppercase animate-pulse">Loading Scholar Portal...</p>
      </div>
    );
  }

  // If API call fails or there's no response, show "Server is under maintenance"
  if (error && !isSettingsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF7F2] text-center p-6">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-[#E5D8CA] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1F3A5F] font-serif mb-3">Server Under Maintenance</h1>
          <p className="text-[#7B654D]/80 text-sm leading-relaxed mb-6 font-light">
            We are currently performing system maintenance or updating our settings. Please try again in a few moments.
          </p>
          <button
            onClick={() => dispatch(fetchSettings())}
            className="px-6 py-2.5 bg-[#1F3A5F] hover:bg-[#162C49] text-white font-semibold rounded shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider font-serif"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-site-bg">
      {/* Premium header navigation */}
      <Navbar />

      {/* Main page content area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer information */}
      <Footer />
    </div>
  );
}
