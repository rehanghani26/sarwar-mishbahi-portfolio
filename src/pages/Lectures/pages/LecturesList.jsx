import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Play, X, Music } from 'lucide-react';
import { getLectures } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { LectureCard, Input } from '@/components';

import { LECTURE_CATEGORIES, LECTURE_TRANSLATIONS } from '@/utils/categories';

export default function LecturesList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeMedia, setActiveMedia] = useState(null); // Lecture document for modal player

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const categories = LECTURE_CATEGORIES;

  const loadLectures = async (category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLectures({ category, search });
      setLectures(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load lectures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures(selectedCategory, searchTerm);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadLectures(selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadLectures(category, searchTerm);
  };

  // Helper to extract YouTube ID and build embedded URL
  const getEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    return url;
  };

  const isAudioMedia = (category) => {
    return category === 'Audio Lectures' || category === 'Bayan Recordings';
  };

  return (
    <div className={`bg-background dark:bg-slate-900 py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-accent dark:text-amber-500 uppercase tracking-widest block mb-1">
            {language === 'en' ? 'MULTIMEDIA LIBRARY' : 'ملٹی میڈیا لائبریری'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-accent font-serif tracking-wide">
            {language === 'en' ? 'Lectures & Sermons' : 'خطابات اور بیانات'}
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            {language === 'en' ? 'Watch video lectures or listen to audio recordings of weekly sermons and Shariah seminars.' : 'ہفتہ وار بیانات اور شرعی سیمینارز کے ویڈیو خطابات دیکھیں یا آڈیو ریکارڈنگز سنیں۔'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className={`premium-card p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-5 ${language === 'ur' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search lectures...' : 'بیانات تلاش کریں...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputClassName={`w-full pr-9 pl-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right text-pr-9' : 'text-left pl-9'}`}
              border=""
            />
            <button type="submit" className={`absolute ${language === 'ur' ? 'right-3' : 'left-3'} top-2.5 text-slate-400 hover:text-primary dark:hover:text-accent`}>
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-start md:justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:border-accent dark:focus:border-accent rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
            >
              <option value="">{language === 'en' ? 'All Formats' : 'تمام فارمیٹس'}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {language === 'ur' ? (LECTURE_TRANSLATIONS[cat] || cat) : cat}
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
            {language === 'en' ? 'All Media' : 'تمام میڈیا'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedCategory === cat
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-border dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-accent dark:hover:border-accent hover:text-primary dark:hover:text-accent'
                }`}
            >
              {language === 'ur' ? (LECTURE_TRANSLATIONS[cat] || cat) : cat}
            </button>
          ))}
        </div>

        {/* Content list Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : lectures && lectures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lectures.map((lecture) => (
              <LectureCard key={lecture._id} lecture={lecture} onPlay={(l) => setActiveMedia(l)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 premium-card">
            <Play className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">
              {language === 'en' ? 'No lectures found' : 'کوئی بیان نہیں ملا'}
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">
              {language === 'en' ? 'Please modify format filter badges or search terms.' : 'براہ کرم فارمیٹ فلٹر بیجز یا تلاش کے الفاظ تبدیل کریں۔'}
            </p>
          </div>
        )}

      </div>

      {/* Embedded Player Media Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/85 p-4" dir={language === 'ur' ? 'rtl' : 'ltr'}>
          <div className="premium-card rounded-lg shadow-2xl overflow-hidden w-full max-w-3xl relative flex flex-col text-start">

            {/* Modal Header */}
            <div className={`bg-primary dark:bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-accent/35 dark:border-slate-700 ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <h3 className={`font-bold text-sm sm:text-md font-serif line-clamp-1 pl-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{activeMedia.title}</h3>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-primary/90 dark:hover:bg-slate-800 focus:outline-none"
                aria-label="Close Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Area */}
            <div className="bg-black aspect-video flex items-center justify-center">
              {isAudioMedia(activeMedia.category) ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-accent dark:text-amber-500 shadow-xl animate-pulse">
                    <Music className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      {language === 'en' ? 'Audio lecture is playing' : 'آڈیو بیان چل رہا ہے'}
                    </span>
                    <span className="text-slate-200 font-light text-sm line-clamp-1">{activeMedia.title}</span>
                  </div>
                  <audio
                    src={activeMedia.videoUrl}
                    controls
                    autoPlay
                    className="w-full max-w-md mt-2"
                  ></audio>
                </div>
              ) : activeMedia.videoUrl.includes('youtube.com') || activeMedia.videoUrl.includes('youtu.be') ? (
                <iframe
                  title={activeMedia.title}
                  src={getEmbedUrl(activeMedia.videoUrl)}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white gap-4">
                  <Play className="w-12 h-12 text-accent" />
                  <p className="text-sm text-slate-300 max-w-sm font-light">
                    {language === 'en' 
                      ? `This video link is located on an external platform (${activeMedia.category}).`
                      : `یہ ویڈیو لنک بیرونی پلیٹ فارم (${categoryTranslations[activeMedia.category] || activeMedia.category}) پر موجود ہے۔`
                    }
                  </p>
                  <a
                    href={activeMedia.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded hover:bg-primary transition-all uppercase tracking-wider font-serif"
                  >
                    {language === 'en' ? 'Open on External Platform' : 'بیرونی پلیٹ فارم پر کھولیں'}
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 max-h-32 overflow-y-auto">
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                {language === 'en' ? 'Description' : 'تفصیل'}
              </span>
              <p className="text-slate-700 dark:text-slate-300 text-xs font-light leading-relaxed">{activeMedia.description}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
