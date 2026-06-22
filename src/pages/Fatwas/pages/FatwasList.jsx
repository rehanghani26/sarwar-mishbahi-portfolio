import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, ShieldAlert } from 'lucide-react';
import { fetchFatwas } from '../../../store/slices/contentSlice';
import FatwaCard from '../../../components/FatwaCard';
import { Input } from '../../../components/Input';

const categoryTranslations = {
  'Salah': 'نماز',
  'Fasting': 'روزه',
  'Zakat': 'زکوٰۃ',
  'Hajj & Umrah': 'حج اور عمرہ',
  'Marriage': 'نکاح / شادی',
  'Divorce': 'طلاق',
  'Business': 'تجارت / کاروبار',
  'Family Issues': 'خاندانی مسائل',
  'Education': 'تعلیم',
  'General Questions': 'عام مسائل',
};

export default function FatwasList() {
  const dispatch = useDispatch();

  const { settings } = useSelector((state) => state.settings);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const { list: fatwas, loading, page, pages } = useSelector((state) => state.content.fatwas);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Salah',
    'Fasting',
    'Zakat',
    'Hajj & Umrah',
    'Marriage',
    'Divorce',
    'Business',
    'Family Issues',
    'Education',
    'General Questions',
  ];

  useEffect(() => {
    dispatch(fetchFatwas({ category: selectedCategory, search: searchTerm, page }));
  }, [dispatch, selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchFatwas({ category: selectedCategory, search: searchTerm, page: 1 }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchFatwas({ category: category, search: searchTerm, page: 1 }));
  };

  const handlePageChange = (pageNum) => {
    dispatch(fetchFatwas({ category: selectedCategory, search: searchTerm, page: pageNum }));
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-site-bg py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Titles */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest block mb-1">
            {language === 'en' ? 'AUTHENTIC ISLAMIC JURISPRUDENCE' : 'مستند اسلامی فقہ'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] tracking-wide">
            {language === 'en' ? 'Fatwas & Shariah Rulings' : 'فتاویٰ اور شرعی احکام'}
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            {language === 'en' ? 'Get Shariah rulings issued by authentic muftis on daily life matters.' : 'روزمرہ کے مسائل کے بارے میں مستند مفتیانِ کرام کے جاری کردہ شرعی احکام حاصل کریں۔'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className={`premium-card p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-5 animate-fade-in ${language === 'ur' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search fatwas...' : 'فتاویٰ تلاش کریں...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputClassName={`w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right' : 'text-left'}`}
              border=""
            />
            <button type="submit" className={`absolute ${language === 'ur' ? 'left-3' : 'right-3'} top-2.5 text-slate-400 hover:text-[#2F241C] dark:hover:text-[#8A6F52]`}>
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Category Dropdown Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 rounded outline-none text-slate-700 dark:text-slate-300 focus:border-[#8A6F52] dark:focus:border-[#8A6F52]"
            >
              <option value="">{language === 'en' ? 'All Categories' : 'تمام زمرے'}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {language === 'ur' ? (categoryTranslations[cat] || cat) : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Topics selection badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 shrink-0">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedCategory === ''
                ? 'bg-[#2F241C] border-[#2F241C] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#8A6F52] dark:hover:border-[#8A6F52] hover:text-[#2F241C] dark:hover:text-[#8A6F52]'
              }`}
          >
            {language === 'en' ? 'All Topics' : 'تمام موضوعات'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedCategory === cat
                  ? 'bg-[#2F241C] border-[#2F241C] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#8A6F52] dark:hover:border-[#8A6F52] hover:text-[#2F241C] dark:hover:text-[#8A6F52]'
                }`}
            >
              {language === 'ur' ? (categoryTranslations[cat] || cat) : cat}
            </button>
          ))}
        </div>

        {/* Content list Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
          </div>
        ) : fatwas && fatwas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {fatwas.map((fatwa) => (
                <FatwaCard key={fatwa._id} fatwa={fatwa} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-1.5 pt-4 text-slate-800 dark:text-white">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 rounded text-xs font-bold border border-[#EAE3CF] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'en' ? 'Previous' : 'پچھلا'}
                </button>
                {[...Array(pages).keys()].map((pNum) => (
                  <button
                    key={pNum + 1}
                    onClick={() => handlePageChange(pNum + 1)}
                    className={`w-8.5 h-8.5 rounded text-xs font-bold border transition-colors ${page === pNum + 1
                        ? 'bg-[#2F241C] border-[#2F241C] text-white'
                        : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                  >
                    {pNum + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="px-3.5 py-1.5 rounded text-xs font-bold border border-[#EAE3CF] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'en' ? 'Next' : 'اگلا'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 premium-card">
            <ShieldAlert className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white">
              {language === 'en' ? 'No fatwas found' : 'کوئی فتویٰ نہیں ملا'}
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">
              {language === 'en' ? 'Please modify your search terms.' : 'براہ کرم اپنے تلاش کے الفاظ تبدیل کریں۔'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
