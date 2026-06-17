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
  'Noto Nastaliq Urdu': "'Noto Nastaliq Urdu', serif",
  'Noto Sans Arabic': "'Noto Sans Arabic', sans-serif",
  'Jameel Noori Nastaleeq': "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif",
  'Mehr Nastaliq': "'Mehr Nastaliq', 'Noto Nastaliq Urdu', serif",
  'Alvi Nastaleeq': "'Alvi Nastaleeq', 'Noto Nastaliq Urdu', serif",
};

export default function MainLayout() {
  const { pathname } = useLocation();
  const { settings } = useSelector((state) => state.settings);

  const lang = settings?.language || 'English';
  const englishFont = settings?.englishFont || 'Inter';
  const urduFont = settings?.urduFont || 'Noto Nastaliq Urdu';

  // Scroll to top automatically when navigation path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Apply typography and direction configuration dynamically
  useEffect(() => {
    const activeFont = lang === 'Urdu' ? urduFont : englishFont;
    const mappedFont = fontFamilies[activeFont] || fontFamilies['Inter'];
    
    document.body.style.fontFamily = mappedFont;
    document.body.dir = lang === 'Urdu' ? 'rtl' : 'ltr';
  }, [lang, englishFont, urduFont]);

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
