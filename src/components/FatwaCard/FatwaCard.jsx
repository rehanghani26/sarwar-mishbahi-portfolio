import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

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

export default function FatwaCard({ fatwa }) {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const { _id, title, category, question, detailedAnswer, publishDate, viewCount } = fatwa;

  const formattedDate = new Date(publishDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
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
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 shrink-0">
        <span className="bg-[#E5D8CA] text-[#7B654D] text-xs font-bold px-2.5 py-1 rounded-full text-[10px]">
          {language === 'ur' ? (categoryTranslations[category] || category) : category}
        </span>
        <div className="flex items-center gap-3.5 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#B08D57]" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#B08D57]" />
            {viewCount} {language === 'en' ? 'views' : 'بار دیکھا گیا'}
          </span>
        </div>
      </div>

      {/* Rulings Title */}
      <h3 className="text-md font-bold text-slate-900 group-hover:text-[#1F3A5F] transition-colors leading-snug mb-3 flex items-start gap-2">
        <FileText className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
        <span className="line-clamp-2">{title}</span>
      </h3>

      {/* Visitor Question Query */}
      <div className="bg-slate-50 border-r-2 border-[#B08D57] p-3 rounded mb-4 shrink-0">
        <span className="block text-xs font-bold text-[#1F3A5F] mb-1">
          {language === 'en' ? 'Question:' : 'سوال:'}
        </span>
        <p className="text-[#2C2C2C] text-xs italic line-clamp-2 leading-relaxed">
          "{question}"
        </p>
      </div>

      {/* Rulings Answer Snippet */}
      <div className="flex-grow">
        <span className="block text-xs font-bold text-slate-500 mb-1">
          {language === 'en' ? 'Fatwa Summary:' : 'خلاصہ فتویٰ:'}
        </span>
        <p className="text-[#2C2C2C] text-sm line-clamp-3 leading-relaxed mb-4 font-light">
          {plainAnswer}
        </p>
      </div>

      {/* Action CTA link */}
      <div className="mt-auto pt-2 shrink-0 flex justify-start">
        <Link
          to={`/fatwas/${_id}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-[#1F3A5F] hover:text-[#B08D57] transition-colors"
        >
          {language === 'en' ? 'View Full Fatwa' : 'مکمل فتویٰ دیکھیں'}
          {language === 'en' ? (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          )}
        </Link>
      </div>

    </div>
  );
}
