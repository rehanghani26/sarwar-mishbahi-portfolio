import React from 'react';
import { Book, Download, ExternalLink, Calendar, Languages } from 'lucide-react';
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
  'Quran': 'قرآن',
  'Hadith': 'حدیث',
  'Fiqh': 'فقہ',
  'Seerah': 'سیرت',
  'Aqeedah': 'عقیدہ',
  'History': 'تاریخ',
  'Biography': 'سوانح',
};

const languageTranslations = {
  'English': 'انگریزی',
  'Urdu': 'اردو',
  'Arabic': 'عربی',
  'Persian': 'فارسی',
};

export default function PublicationCard({ publication }) {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const { title, description, category, language: pubLanguage, author, publicationDate, googleDriveLink } = publication;

  const formattedDate = new Date(publicationDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });

  return (
    <div className={`premium-card p-5 flex flex-col h-full hover:shadow-md transition-all group ${language === 'ur' ? 'text-right' : 'text-left'}`}>

      {/* Category Badge & Book Icon */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 shrink-0">
        <span className="bg-[#E5D8CA] text-[#7B654D] text-xs font-bold px-2.5 py-1 rounded-full text-[10px]">
          {language === 'ur' ? (categoryTranslations[category] || category) : category}
        </span>
        <Book className="w-5 h-5 text-[#B08D57]" />
      </div>

      {/* Book Metadata details */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3 shrink-0 justify-start">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#B08D57]" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <Languages className="w-3.5 h-3.5 text-[#B08D57]" />
          {language === 'ur' ? (languageTranslations[pubLanguage] || pubLanguage) : pubLanguage}
        </span>
      </div>

      {/* Title */}
      <h3 className={`text-md font-bold text-slate-900 group-hover:text-[#1F3A5F] transition-colors leading-snug mb-2 font-serif line-clamp-2 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
        {title}
      </h3>

      {/* Author Details */}
      <span className={`block text-xs font-semibold text-[#B08D57] mb-3 shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
        {language === 'en' ? 'Author:' : 'مصنف:'} {author}
      </span>

      {/* Description */}
      <div className={`flex-grow ${language === 'ur' ? 'text-right' : 'text-left'}`}>
        <p className={`text-[#2C2C2C] text-xs font-light leading-relaxed line-clamp-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          {description}
        </p>
      </div>

      {/* Drive Action link buttons */}
      <div className={`mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
        <a
          href={googleDriveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1F3A5F] hover:bg-[#162C49] rounded transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {language === 'en' ? 'View on Drive' : 'ڈرائیو پر دیکھیں'}
        </a>
        <a
          href={googleDriveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 text-slate-600 hover:text-white bg-slate-100 hover:bg-[#B08D57] rounded transition-colors"
          title={language === 'en' ? 'Download Document' : 'دستاویز ڈاؤن لوڈ کریں'}
        >
          <Download className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
