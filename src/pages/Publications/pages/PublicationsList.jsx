import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { fetchPublications } from '../../../store/slices/contentSlice';
import PublicationCard from '../../../components/PublicationCard';

export default function PublicationsList() {
  const dispatch = useDispatch();

  const { list: publications, loading } = useSelector((state) => state.content.publications);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Quran Studies',
    'Hadith',
    'Fiqh',
    'Aqeedah',
    'Seerah',
    'Islamic History',
    'Fatwa Collections',
    'Research Papers',
  ];

  useEffect(() => {
    dispatch(fetchPublications({ category: selectedCategory, search: searchTerm }));
  }, [dispatch, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchPublications({ category: selectedCategory, search: searchTerm }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchPublications({ category: category, search: searchTerm }));
  };

  return (
    <div className="bg-[#FAF9F5] dark:bg-slate-900 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">Scholarly Works</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif tracking-wide">Books & Publications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            Access, download, and study books, papers, and notes directly hosted on Google Drive.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="premium-card p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
            />
            <button type="submit" className="absolute left-3 top-2.5 text-slate-400 hover:text-[#2F241C] dark:hover:text-[#8A6F52]">
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Category Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:border-[#8A6F52] dark:focus:border-[#8A6F52] rounded outline-none"
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

        {/* Quick Topics Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 shrink-0">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              selectedCategory === ''
                ? 'bg-[#2F241C] border-[#2F241C] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#8A6F52] dark:hover:border-[#8A6F52] hover:text-[#2F241C] dark:hover:text-[#8A6F52]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2F241C] border-[#2F241C] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#8A6F52] dark:hover:border-[#8A6F52] hover:text-[#2F241C] dark:hover:text-[#8A6F52]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content list Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
          </div>
        ) : publications && publications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub) => (
              <PublicationCard key={pub._id} publication={pub} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 premium-card">
            <BookOpen className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">No Publications Available</h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">Try resetting the keyword search query or subject filters.</p>
          </div>
        )}

      </div>
    </div>
  );
}
