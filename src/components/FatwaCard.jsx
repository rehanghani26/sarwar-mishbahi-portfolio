import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, FileText, ArrowRight } from 'lucide-react';
import useTranslate from '../hooks/useTranslate';

export default function FatwaCard({ fatwa }) {
  const { _id, title, category, question, detailedAnswer, publishDate, viewCount } = fatwa;
  const { t, isUrdu } = useTranslate();

  const formattedDate = new Date(publishDate).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Strip HTML tags for answer preview
  const plainAnswer = detailedAnswer
    ? detailedAnswer.replace(/<[^>]*>/g, '')
    : '';

  return (
    <div className="premium-card p-6 flex flex-col h-full group text-start">
      
      {/* Category and stats metadata */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
        <span className="bg-[#2F241C]/10 dark:bg-amber-950/30 text-[#2F241C] dark:text-[#8A6F52] text-xs font-bold px-2.5 py-1 rounded">
          {t(category)}
        </span>
        <div className="flex items-center gap-3.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#8A6F52] dark:text-amber-500" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#8A6F52] dark:text-amber-500" />
            {viewCount} {t('views')}
          </span>
        </div>
      </div>

      {/* Rulings Title */}
      <h3 className="text-md font-bold text-slate-900 dark:text-white group-hover:text-[#2F241C] dark:group-hover:text-[#8A6F52] transition-colors leading-snug mb-3 font-serif flex items-start gap-2">
        <FileText className="w-5 h-5 text-[#8A6F52] dark:text-amber-500 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{title}</span>
      </h3>

      {/* Visitor Question Query */}
      <div className="bg-slate-50 dark:bg-slate-800/80 border-l-2 border-[#8A6F52] p-3 rounded mb-4 shrink-0">
        <span className="block text-xs font-bold text-[#2F241C] dark:text-[#8A6F52] mb-1">{t('QUESTION:')}</span>
        <p className="text-slate-700 dark:text-slate-300 text-xs italic line-clamp-2 leading-relaxed">
          "{question}"
        </p>
      </div>

      {/* Rulings Answer Snippet */}
      <div className="flex-grow">
        <span className="block text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">{t('RULING SUMMARY:')}</span>
        <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-3 leading-relaxed mb-4 font-light">
          {plainAnswer}
        </p>
      </div>

      {/* Action CTA link */}
      <div className="mt-auto pt-2 shrink-0 flex justify-start">
        <Link
          to={`/fatwas/${_id}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400 transition-colors"
        >
          {t('View Full Ruling')}
          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isUrdu ? 'rotate-180' : ''}`} />
        </Link>
      </div>

    </div>
  );
}
