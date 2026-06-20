import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { fetchArticles } from '../../../store/slices/contentSlice';
import ArticleCard from '../../../components/ArticleCard';
import { Input } from '../../../components/Input';

export default function ArticlesList() {
  const dispatch = useDispatch();

  const { list: articles, loading, page, pages } = useSelector((state) => state.content.articles);

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

  useEffect(() => {
    dispatch(fetchArticles({ category: selectedCategory, search: searchTerm, page }));
  }, [dispatch, selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchArticles({ category: selectedCategory, search: searchTerm, page: 1 }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchArticles({ category: category, search: searchTerm, page: 1 }));
  };

  const handlePageChange = (pageNum) => {
    dispatch(fetchArticles({ category: selectedCategory, search: searchTerm, page: pageNum }));
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-site-bg py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">Authentic Guidance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif tracking-wide">Islamic Articles</h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            Explore verified write-ups and scholarly analysis on a variety of classical and contemporary Islamic topics.
          </p>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="premium-card p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputClassName="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
              border=""
            />
            <button type="submit" className="absolute left-3 top-2.5 text-slate-400 hover:text-[#2F241C] dark:hover:text-[#8A6F52]">
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Category Dropdown & Quick Badges */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 rounded outline-none text-slate-700 dark:text-slate-300 focus:border-[#8A6F52] dark:focus:border-[#8A6F52]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
                ? 'bg-[#2F241C] border-[#2F241C] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#8A6F52] dark:hover:border-[#8A6F52] hover:text-[#2F241C] dark:hover:text-[#8A6F52]'
              }`}
          >
            All Topic Areas
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
              {cat}
            </button>
          ))}
        </div>

        {/* Content list Loader */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
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
                  className="px-3.5 py-1.5 rounded text-xs font-bold border border-[#EAE3CF] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Previous
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
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 premium-card">
            <BookOpen className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">No Articles Found</h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">Try resetting your category filters or search inputs.</p>
          </div>
        )}

      </div>
    </div>
  );
}
