import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Eye, ArrowRight, Bookmark, Hash, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { fetchArticleBySlug } from '../../../store/slices/contentSlice';
import ArticleCard from '../../../components/ArticleCard';

export default function ArticleDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { current, loading, error } = useSelector((state) => state.content.articles);

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug));
  }, [dispatch, slug]);

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
        <h2 className="text-2xl font-bold text-red-700">مضمون لوڈ کرنے میں خرابی</h2>
        <p className="text-slate-550 text-sm mt-2">{error || 'مضمون نہیں ملا۔'}</p>
        <Link to="/articles" className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 bg-[#2F241C] text-white rounded font-semibold text-sm hover:bg-[#1E1915]">
          <ArrowRight className="w-4.5 h-4.5" /> مقالات پر واپس جائیں
        </Link>
      </div>
    );
  }

  const { article, related } = current;
  const { title, summary, category, tags, featuredImage, fullContent, references, publishDate, viewCount } = article;

  const formattedDate = new Date(publishDate).toLocaleDateString('ur-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shareUrl = window.location.href;

  const handleShareClick = (platform) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + shareUrl)}`;
        break;
      default:
        break;
    }
    if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="bg-site-bg py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb back button */}
        <Link to="/articles" className="inline-flex items-center gap-1 text-sm font-bold text-text-primary hover:text-[#8A6F52] dark:hover:text-amber-400 mb-6">
          <ArrowRight className="w-4 h-4" /> مقالات پر واپس جائیں
        </Link>

        {/* Article Details Container */}
        <article className="premium-card overflow-hidden mb-12">
          
          {/* Main Cover Image */}
          <div className="h-64 sm:h-[400px] w-full bg-slate-100 dark:bg-slate-950 relative">
            <img
              src={featuredImage || placeholderImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#2F241C] dark:bg-[#8A6F52] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded shadow-md">
              {category}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#8A6F52] dark:text-amber-500" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#8A6F52] dark:text-amber-500" />
                {viewCount} بار دیکھا گیا
              </span>
            </div>

            {/* Title & Summary */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary font-serif leading-tight mb-4 tracking-wide">
              {title}
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-md font-light leading-relaxed italic border-r-4 border-[#8A6F52] dark:border-amber-500 pr-4 mb-8 text-right">
              {summary}
            </p>

            {/* Rich Content rendering */}
            <div
              className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-light text-base space-y-5"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            ></div>

            {/* Reference section */}
            {references && references.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#8A6F52] dark:text-amber-500" /> حوالہ جات / مراجع
                </h3>
                <ul className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {references.map((ref, idx) => (
                    <li key={idx} className="font-light">{ref}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags & Sharing Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {tags && tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-0.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                    <Hash className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Share actions */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <Share2 className="w-4 h-4 text-[#8A6F52] dark:text-amber-500" /> شیئر کریں:
                </span>
                <button
                  onClick={() => handleShareClick('facebook')}
                  className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-text-primary hover:bg-[#2F241C] dark:hover:bg-[#8A6F52] hover:text-white dark:hover:text-white transition-colors"
                  title="فیس بک پر شیئر کریں"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleShareClick('twitter')}
                  className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-text-primary hover:bg-[#2F241C] dark:hover:bg-[#8A6F52] hover:text-white dark:hover:text-white transition-colors"
                  title="ٹویٹر پر شیئر کریں"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleShareClick('whatsapp')}
                  className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-text-primary hover:bg-[#2F241C] dark:hover:bg-[#8A6F52] hover:text-white dark:hover:text-white transition-colors"
                  title="واٹس ایپ پر شیئر کریں"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </article>

        {/* Related Articles Section */}
        {related && related.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-site-border">
              متعلقہ مقالات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ArticleCard key={rel._id} article={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
