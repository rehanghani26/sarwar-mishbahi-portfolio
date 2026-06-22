import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';

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

export default function ArticleCard({ article }) {
  const { settings } = useSelector((state) => state.settings);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const { title, slug, summary, category, featuredImage, publishDate, viewCount } = article;

  const formattedDate = new Date(publishDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const placeholderImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="premium-card flex flex-col h-full overflow-hidden group">

      {/* Featured Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
        <img
          src={featuredImage || placeholderImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-[#E5D8CA] text-[#7B654D] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
          {language === 'ur' ? (categoryTranslations[category] || category) : category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow text-start">

        {/* Date and View Statistics */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 justify-start">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B08D57]" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#B08D57]" />
            {viewCount} {language === 'en' ? 'views' : 'بار دیکھا گیا'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1F3A5F] transition-colors line-clamp-2 leading-snug mb-4">
          {title}
        </h3>

        {/* Summary Description */}
        <p className="text-[#2C2C2C] text-sm line-clamp-3 leading-relaxed mb-4 font-light">
          {summary}
        </p>

        {/* Read More link */}
        <div className="mt-auto pt-2 justify-start flex">
          <Link
            to={`/articles/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1F3A5F] hover:text-[#B08D57] transition-colors"
          >
            {language === 'en' ? 'Read Article' : 'مضمون پڑھیں'}
            {language === 'en' ? (
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            )}
          </Link>
        </div>

      </div>

    </div>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    publishDate: PropTypes.string.isRequired,
    viewCount: PropTypes.number.isRequired,
  }).isRequired,
};
