import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { getArticles } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { ArticleCard, Input } from '@/components';

const categoryTranslations = {
  'Quran': 'قرآن',
  'Hadith': 'حدیث',
  'Fiqh': 'فقہ',
  'Aqeedah': 'عقیدہ',
  'Seerah': 'سیرت',
  'Islamic History': 'اسلامی تاریخ',
  'Family Matters': 'خاندانی معاملات',
  'Education': 'تعلیم',
  'Dawah': 'دعوت',
  'General Islam': 'عام معلوماتِ اسلام',
};

export default function ArticlesList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Quran',
    'Hadith',
    'Fiqh',
    'Aqeedah',
    'Seerah',
    'Islamic History',
    'Family Matters',
    'Education',
    'Dawah',
    'General Islam',
  ];

  const loadArticles = async (pageNum = page, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticles({ category, search, page: pageNum, limit: 6 });
      setArticles(data.articles || []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadArticles(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadArticles(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    loadArticles(pageNum, selectedCategory, searchTerm);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-site-bg py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-[#B08D57] dark:text-amber-500 uppercase tracking-widest block mb-1">
            {language === 'en' ? 'AUTHENTIC GUIDANCE' : 'مستند رہنمائی'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F3A5F] dark:text-[#B08D57] tracking-wide">
            {language === 'en' ? 'Islamic Articles' : 'اسلامی مقالات'}
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            {language === 'en' ? 'Read authentic and research-based Islamic articles on various topics.' : 'مختلف موضوعات پر مستند اور تحقیقی اسلامی مقالات کا مطالعہ کریں۔'}
          </p>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className={`premium-card p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-5 ${language === 'ur' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search articles...' : 'مقالات تلاش کریں...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputClassName={`w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#E5D8CA] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#B08D57] dark:focus:border-[#B08D57] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right' : 'text-left'}`}
              border=""
            />
            <button type="submit" className={`absolute ${language === 'ur' ? 'left-3' : 'right-3'} top-2.5 text-slate-400 hover:text-[#1F3A5F] dark:hover:text-[#B08D57]`}>
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Category Dropdown & Quick Badges */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#E5D8CA] dark:border-slate-700 rounded outline-none text-slate-700 dark:text-slate-300 focus:border-[#B08D57] dark:focus:border-[#B08D57]"
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

        {/* Categories Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 shrink-0">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedCategory === ''
                ? 'bg-[#1F3A5F] border-[#1F3A5F] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border-[#E5D8CA] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#B08D57] dark:hover:border-[#B08D57] hover:text-[#1F3A5F] dark:hover:text-[#B08D57]'
              }`}
          >
            {language === 'en' ? 'All Topics' : 'تمام موضوعات'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedCategory === cat
                  ? 'bg-[#1F3A5F] border-[#1F3A5F] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-[#E5D8CA] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#B08D57] dark:hover:border-[#B08D57] hover:text-[#1F3A5F] dark:hover:text-[#B08D57]'
                }`}
            >
              {language === 'ur' ? (categoryTranslations[cat] || cat) : cat}
            </button>
          ))}
        </div>

        {/* Content list Loader */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A5F]"></div>
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-1.5 pt-4 text-slate-800 dark:text-white">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 rounded text-xs font-bold border border-[#E5D8CA] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'en' ? 'Previous' : 'پچھلا'}
                </button>
                {[...Array(pages).keys()].map((pNum) => (
                  <button
                    key={pNum + 1}
                    onClick={() => handlePageChange(pNum + 1)}
                    className={`w-8.5 h-8.5 rounded text-xs font-bold border transition-colors ${page === pNum + 1
                        ? 'bg-[#1F3A5F] border-[#1F3A5F] text-white'
                        : 'bg-white dark:bg-slate-800 border-[#E5D8CA] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                  >
                    {pNum + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="px-3.5 py-1.5 rounded text-xs font-bold border border-[#E5D8CA] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'en' ? 'Next' : 'اگلا'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 premium-card">
            <BookOpen className="w-12 h-12 text-[#B08D57] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white">
              {language === 'en' ? 'No articles found' : 'کوئی مضمون نہیں ملا'}
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">
              {language === 'en' ? 'Please modify search terms or category filters.' : 'براہ کرم تلاش کے الفاظ یا زمرے کے فلٹرز تبدیل کریں۔'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
