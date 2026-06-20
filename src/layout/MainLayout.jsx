import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const { settings } = useSelector((state) => state.settings);

  const englishFont = settings?.englishFont || 'Inter';

  // Scroll to top automatically when navigation path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Apply typography and direction configuration dynamically
  useEffect(() => {
    const mappedFont = fontFamilies[englishFont] || fontFamilies['Inter'];
    
    document.body.style.fontFamily = mappedFont;
    document.body.dir = 'ltr';
  }, [englishFont]);

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
