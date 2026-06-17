import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Eye, ArrowLeft, Bookmark, HelpCircle, FileText } from 'lucide-react';
import { fetchFatwaById } from '../../../store/slices/contentSlice';
import FatwaCard from '../../../components/FatwaCard';

export default function FatwaDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current, loading, error } = useSelector((state) => state.content.fatwas);

  useEffect(() => {
    dispatch(fetchFatwaById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-site-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-dark"></div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-700 font-serif">Error Loading Fatwa</h2>
        <p className="text-slate-550 text-sm mt-2">{error || 'Fatwa not found.'}</p>
        <Link to="/fatwas" className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 bg-[#2F241C] text-white rounded font-semibold text-sm hover:bg-[#1E1915]">
          <ArrowLeft className="w-4.5 h-4.5" /> Back to Fatwas
        </Link>
      </div>
    );
  }

  const { fatwa, related } = current;
  const { title, category, question, detailedAnswer, references, publishDate, viewCount } = fatwa;

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-site-bg py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb back button */}
        <Link to="/fatwas" className="inline-flex items-center gap-1 text-sm font-bold text-text-primary hover:text-[#8A6F52] dark:hover:text-amber-400 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Fatwas
        </Link>
 
        {/* Fatwa Details Container */}
        <div className="premium-card overflow-hidden mb-12">
          
          {/* Header Banner */}
          <div className="bg-[#2F241C] islamic-pattern text-white px-6 py-8 sm:px-10 relative border-b border-[#8A6F52]/35">
            <span className="bg-[#8A6F52] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded shadow-sm inline-block mb-3 font-serif">
              {category}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight font-serif tracking-wide">
              {title}
            </h1>
          </div>

          <div className="p-6 sm:p-10">
            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#8A6F52] dark:text-amber-500" />
                Published on {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#8A6F52] dark:text-amber-500" />
                {viewCount} views
              </span>
            </div>
 
            {/* 1. Original Question block */}
            <div className="mb-8 bg-slate-50 dark:bg-slate-800/60 border-l-4 border-[#8A6F52] dark:border-amber-500 rounded-r p-5 sm:p-6 shadow-xs">
              <h2 className="text-sm font-bold text-text-primary font-serif flex items-center gap-2 mb-3 tracking-wide">
                <HelpCircle className="w-5 h-5 text-[#8A6F52] dark:text-amber-500 shrink-0" />
                Submitted Question Details
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed font-light">
                "{question}"
              </p>
            </div>
 
            {/* 2. Scholar Answer block */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-serif flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2 tracking-wide">
                <FileText className="w-5 h-5 text-[#8A6F52] dark:text-amber-500 shrink-0" />
                Shariah Verdict & Detailed Ruling
              </h2>
              <div
                className="prose max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-light text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: detailedAnswer }}
              ></div>
            </div>

            {/* 3. Classical References list */}
            {references && references.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest font-serif mb-3 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#8A6F52] dark:text-amber-500" /> Scholarly References / Textual Sources
                </h3>
                <ul className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {references.map((ref, idx) => (
                    <li key={idx} className="font-light">{ref}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* Related Fatwas Grid */}
        {related && related.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-text-primary font-serif mb-6 pb-2 border-b border-site-border">
              Related Fatwas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <FatwaCard key={rel._id} fatwa={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
