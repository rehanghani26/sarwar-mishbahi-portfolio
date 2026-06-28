import React, { useState } from 'react';
import { Book, Download, ExternalLink, FileText } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';
import { BACKEND_URL } from '@/constants/urls';
import { PUBLICATION_CATEGORY_TRANSLATIONS, BOOK_LANGUAGE_TRANSLATIONS } from '@/utils/categories';
import { PdfViewer } from '../PdfViewer';

function BookCoverPlaceholder({ title, category }) {
  return (
    <div
      style={{ backgroundColor: COLORS.primary, borderColor: COLORS.accent }}
      className="w-[110px] h-[150px] shrink-0 border-2 rounded-md shadow-md flex flex-col items-center justify-between p-3 relative overflow-hidden select-none"
    >
      {/* Decorative inner gold border frame */}
      <div
        style={{ borderColor: 'rgba(184, 156, 125, 0.25)' }}
        className="absolute inset-1.5 border rounded"
      />

      {/* Mini top tag */}
      <span className="text-[8px] font-bold text-accent/80 z-10 tracking-widest uppercase text-center line-clamp-1">
        {category || 'Islamic Book'}
      </span>

      {/* Center decoration icon */}
      <Book className="w-8 h-8 text-accent/50 z-10" />

      {/* Title snippet */}
      <span
        className="text-[9px] font-semibold text-white/90 z-10 text-center line-clamp-2 leading-tight font-serif"
        dir="rtl"
      >
        {title}
      </span>
    </div>
  );
}

export default function PublicationCard({ publication }) {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Backend model fields:
  // title, slug, summary, category, author, blanguage, pageCount,
  // coverImage: { url, public_id }, pdf: { url, public_id }, publishDate, viewCount, downloadCount
  const {
    title,
    summary,
    category,
    blanguage,
    author,
    publishDate,
    coverImage,
    pdf,
    pageCount,
  } = publication;

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
        year: 'numeric',
        month: 'short',
      })
    : '';

  // coverImage is { url, public_id } from backend
  const getCoverImageSrc = (img) => {
    if (!img) return null;
    const url = typeof img === 'object' ? img.url : img;
    if (!url) return null;
    if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
    return url;
  };

  // pdf is { url, public_id } from backend
  const pdfUrl = pdf?.url || (typeof pdf === 'string' ? pdf : null);

  const coverImageSrc = getCoverImageSrc(coverImage);
  const isRTL = language === 'ur';

  return (
    <div
      style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
      className={`border rounded-xl p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-all group relative overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Book Cover Image Container */}
      <div className="flex justify-center sm:justify-start shrink-0">
        {coverImageSrc ? (
          <img
            src={coverImageSrc}
            alt={title}
            className="w-[110px] h-[150px] shrink-0 object-cover rounded-md shadow-md border"
            style={{ borderColor: COLORS.border }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <BookCoverPlaceholder title={title} category={category} />
        )}
      </div>

      {/* Book details container */}
      <div className="flex flex-col flex-grow min-w-0 justify-between">
        <div>
          {/* Category Badge & Language */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 shrink-0">
            <span
              style={{ backgroundColor: COLORS.secondary, color: COLORS.primary }}
              className="text-xs font-bold px-2.5 py-1 rounded-full text-[10px]"
            >
              {language === 'ur' ? (PUBLICATION_CATEGORY_TRANSLATIONS[category] || category) : category}
            </span>
            {blanguage && (
              <span className="text-[10px] text-slate-500 font-medium">
                {BOOK_LANGUAGE_TRANSLATIONS[blanguage] || blanguage}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{ color: COLORS.textPrimary }}
            className={`text-md font-bold leading-snug mb-1 font-serif line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {title}
          </h3>

          {/* Author Details & Date */}
          <div className="flex items-center justify-between mb-2 shrink-0 text-[11px] text-slate-500">
            {author && (
              <span style={{ color: COLORS.accent }} className="font-semibold">
                {language === 'en' ? 'Author:' : 'مصنف:'} {author}
              </span>
            )}
            <span>{formattedDate}</span>
          </div>

          {/* Page count if available */}
          {pageCount && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
              <FileText className="w-3 h-3" />
              <span>{pageCount} {language === 'en' ? 'pages' : 'صفحات'}</span>
            </div>
          )}

          {/* Summary/Description */}
          {summary && (
            <p className={`text-xs font-light leading-relaxed line-clamp-2 ${isRTL ? 'text-right' : 'text-left'} mb-3`} style={{ color: COLORS.textSecondary }}>
              {summary}
            </p>
          )}
        </div>

        {/* Action Link Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          {pdfUrl ? (
            <>
              <button
                type="button"
                onClick={() => setIsPdfOpen(true)}
                style={{ backgroundColor: COLORS.primary }}
                className="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded hover:opacity-90 transition-opacity cursor-pointer border-0"
              >
                <ExternalLink className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
                {language === 'en' ? 'View PDF' : 'پی ڈی ایف دیکھیں'}
              </button>
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: COLORS.background }}
                className="flex items-center justify-center p-2 text-slate-600 rounded hover:bg-slate-200 transition-colors decoration-none"
                title={language === 'en' ? 'Download PDF' : 'پی ڈی ایف ڈاؤن لوڈ کریں'}
              >
                <Download className="w-4 h-4" />
              </a>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">
              {language === 'en' ? 'No PDF available' : 'پی ڈی ایف دستیاب نہیں'}
            </span>
          )}
        </div>
      </div>

      {/* Lightbox PDF Viewer */}
      {isPdfOpen && pdfUrl && (
        <PdfViewer 
          url={pdfUrl} 
          title={title} 
          isModal={true} 
          onClose={() => setIsPdfOpen(false)} 
        />
      )}
    </div>
  );
}
