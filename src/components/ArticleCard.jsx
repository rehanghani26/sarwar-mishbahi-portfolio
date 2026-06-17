import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import useTranslate from '../hooks/useTranslate';

export default function ArticleCard({ article }) {
  const { title, slug, summary, category, featuredImage, publishDate, viewCount } = article;
  const { t, isUrdu } = useTranslate();

  const formattedDate = new Date(publishDate).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
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
        <div className="absolute top-3 left-3 bg-[#2F241C] dark:bg-[#8A6F52] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
          {t(category)}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow text-start">
        
        {/* Date and View Statistics */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4 justify-start">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#8A6F52] dark:text-amber-500" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#8A6F52] dark:text-amber-500" />
            {viewCount} {t('views')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#2F241C] dark:group-hover:text-[#8A6F52] transition-colors line-clamp-2 leading-snug mb-4 font-serif">
          {title}
        </h3>

        {/* Summary Description */}
        <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-3 leading-relaxed mb-4 font-light">
          {summary}
        </p>

        {/* Read More link */}
        <div className="mt-auto pt-2 justify-start flex">
          <Link
            to={`/articles/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400 transition-colors"
          >
            {t('Read Article')}
            <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isUrdu ? 'rotate-180' : ''}`} />
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
