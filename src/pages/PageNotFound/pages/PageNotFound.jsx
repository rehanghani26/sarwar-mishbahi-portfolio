import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function PageNotFound() {
  const { settings } = useSelector((state) => state.settings);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <div className={`bg-[#FAF9F5] dark:bg-slate-900 min-h-[70vh] flex flex-col items-center justify-center p-6 text-center transition-colors duration-200`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="w-16 h-16 rounded-full bg-[#2F241C]/10 dark:bg-emerald-900/20 flex items-center justify-center text-[#2F241C] dark:text-emerald-400 mb-6 animate-bounce">
        <HelpCircle className="w-8 h-8 text-[#8A6F52] dark:text-[#EAD075]" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#2F241C] dark:text-emerald-400 font-serif tracking-wider mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-serif mb-4">
        {language === 'en' ? 'Page Not Found' : 'صفحہ نہیں ملا'}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm font-light mb-8 leading-relaxed">
        {language === 'en'
          ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
          : 'آپ جو صفحہ تلاش کر رہے ہیں وہ شاید ہٹا دیا گیا ہے، اس کا نام تبدیل کر دیا گیا ہے، یا عارضی طور پر دستیاب نہیں ہے۔'}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2F241C] hover:bg-[#1E1915] dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white text-xs font-bold rounded shadow transition-all uppercase tracking-wider font-serif"
      >
        <ArrowRight className={`w-4 h-4 text-[#8A6F52] dark:text-[#EAD075] ${language === 'en' ? 'rotate-180' : ''}`} />
        {language === 'en' ? 'Return to Home Page' : 'صفحہ اول پر واپس جائیں'}
      </Link>
    </div>
  );
}
