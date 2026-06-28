import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { getPublications } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { PublicationCard, Input } from '@/components';

import { PUBLICATION_CATEGORIES, PUBLICATION_TRANSLATIONS, PUBLICATION_EN_LABELS } from '@/utils/categories';

export default function PublicationsList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const categories = PUBLICATION_CATEGORIES;

  const loadPublications = async (pageNum = page, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublications({ category, search, page: pageNum, limit: 6 });
      // Backend returns { books, page, pages, total }
      setPublications(data.books || []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPublications(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadPublications(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    loadPublications(pageNum, selectedCategory, searchTerm);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`bg-background dark:bg-slate-900 py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-accent dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">
            {language === 'en' ? 'SCIENTIFIC WORKS' : 'علمی تصانیف'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-accent font-serif tracking-wide">
            {language === 'en' ? 'Books & Publications' : 'کتب و مطبوعات'}
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            {language === 'en' ? 'Access and study books, articles, and educational notes on Google Drive.' : 'گوگل ڈرائیو پر موجود کتابیں، مقالات اور تعلیمی نوٹس حاصل کریں اور ان کا مطالعہ کریں۔'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className={`premium-card p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-5 ${language === 'ur' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search publications...' : 'مطبوعات تلاش کریں...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputClassName={`w-full pr-9 pl-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right text-pr-9' : 'text-left pl-9'}`}
              border=""
            />
            <button type="submit" className={`absolute ${language === 'ur' ? 'right-3' : 'left-3'} top-2.5 text-slate-400 hover:text-primary dark:hover:text-accent`}>
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Category Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-start md:justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 rounded outline-none text-slate-700 dark:text-slate-300 focus:border-accent dark:focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
            >
              <option value="">{language === 'en' ? 'All Categories' : 'تمام زمرے'}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {language === 'ur' ? cat.labelUr : cat.labelEn}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Topics Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 shrink-0">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedCategory === ''
                ? 'bg-primary border-primary text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border-border dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-accent dark:hover:border-accent hover:text-primary dark:hover:text-accent'
              }`}
          >
            {language === 'en' ? 'All Topics' : 'تمام زمرے'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedCategory === cat.value
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-border dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-accent dark:hover:border-accent hover:text-primary dark:hover:text-accent'
                }`}
            >
              {language === 'ur' ? cat.labelUr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Content list Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : publications && publications.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {publications.map((pub) => (
                <PublicationCard key={pub._id} publication={pub} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-1.5 pt-4 text-slate-800 dark:text-white">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 rounded text-xs font-bold border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'en' ? 'Previous' : 'پچھلا'}
                </button>
                {[...Array(pages).keys()].map((pNum) => (
                  <button
                    key={pNum + 1}
                    onClick={() => handlePageChange(pNum + 1)}
                    className={`w-8 h-8 rounded text-xs font-bold border transition-colors ${page === pNum + 1
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white dark:bg-slate-800 border-border dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                  >
                    {pNum + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="px-3.5 py-1.5 rounded text-xs font-bold border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'en' ? 'Next' : 'اگلا'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 premium-card">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">
              {language === 'en' ? 'No publications available' : 'کوئی مطبوعہ دستیاب نہیں ہے'}
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">
              {language === 'en' ? 'Please try changing the search terms or topic filters.' : 'براہ کرم تلاش کے الفاظ یا موضوع کے فلٹرز کو تبدیل کرنے کی کوشش کریں۔'}
            </p>
          </div>
        )}


      </div>
    </div>
  );
}
