import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, Play, X, Music } from 'lucide-react';
import { fetchLectures } from '../../../store/slices/contentSlice';
import LectureCard from '../../../components/LectureCard';
import { Input } from '../../../components/Input';

const categoryTranslations = {
  'YouTube Videos': 'یوٹیوب ویڈیوز',
  'Facebook Videos': 'فیس بک ویڈیوز',
  'Audio Lectures': 'آڈیو خطابات',
  'Bayan Recordings': 'آڈیو بیانات',
  'Friday Sermons': 'خطبات جمعہ',
  'Short Clips': 'مختصر کلپس',
  'Sermons': 'بیانات',
};

export default function LecturesList() {
  const dispatch = useDispatch();

  const { settings } = useSelector((state) => state.settings);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const { list: lectures, loading } = useSelector((state) => state.content.lectures);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeMedia, setActiveMedia] = useState(null); // Lecture document for modal player

  const categories = [
    'YouTube Videos',
    'Facebook Videos',
    'Audio Lectures',
    'Bayan Recordings',
  ];

  useEffect(() => {
    dispatch(fetchLectures({ category: selectedCategory, search: searchTerm }));
  }, [dispatch, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchLectures({ category: selectedCategory, search: searchTerm }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchLectures({ category: category, search: searchTerm }));
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
    <div className={`bg-[#FAF9F5] dark:bg-slate-900 py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest block mb-1">
            {language === 'en' ? 'MULTIMEDIA LIBRARY' : 'ملٹی میڈیا لائبریری'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif tracking-wide">
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
              inputClassName={`w-full pr-9 pl-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right text-pr-9' : 'text-left pl-9'}`}
              border=""
            />
            <button type="submit" className={`absolute ${language === 'ur' ? 'right-3' : 'left-3'} top-2.5 text-slate-400 hover:text-[#2F241C] dark:hover:text-[#8A6F52]`}>
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-start md:justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:border-[#8A6F52] dark:focus:border-[#8A6F52] rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
            >
              <option value="">{language === 'en' ? 'All Formats' : 'تمام فارمیٹس'}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {language === 'ur' ? (categoryTranslations[cat] || cat) : cat}
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
                ? 'bg-[#2F241C] border-[#2F241C] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#8A6F52] dark:hover:border-[#8A6F52] hover:text-[#2F241C] dark:hover:text-[#8A6F52]'
              }`}
          >
            {language === 'en' ? 'All Media' : 'تمام میڈیا'}
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
        ) : lectures && lectures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lectures.map((lecture) => (
              <LectureCard key={lecture._id} lecture={lecture} onPlay={(l) => setActiveMedia(l)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 premium-card">
            <Play className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4" dir={language === 'ur' ? 'rtl' : 'ltr'}>
          <div className="premium-card rounded-lg shadow-2xl overflow-hidden w-full max-w-3xl relative flex flex-col text-start">

            {/* Modal Header */}
            <div className={`bg-[#2F241C] dark:bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-[#8A6F52]/35 dark:border-slate-700 ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <h3 className={`font-bold text-sm sm:text-md font-serif line-clamp-1 pl-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{activeMedia.title}</h3>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-[#1E1915] dark:hover:bg-slate-800 focus:outline-none"
                aria-label="Close Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Area */}
            <div className="bg-black aspect-video flex items-center justify-center">
              {isAudioMedia(activeMedia.category) ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-[#2F241C] flex items-center justify-center text-[#8A6F52] dark:text-amber-500 shadow-xl animate-pulse">
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
                  <Play className="w-12 h-12 text-[#8A6F52]" />
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
                    className="px-5 py-2.5 bg-[#8A6F52] text-white font-bold text-xs rounded hover:bg-[#2F241C] transition-all uppercase tracking-wider font-serif"
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
