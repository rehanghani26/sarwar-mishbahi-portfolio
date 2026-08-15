import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Calendar, Eye, ArrowRight, ArrowLeft, Bookmark, Hash, Share2,
  Facebook, Twitter, MessageCircle, ExternalLink, Download, Printer,
  Heart, Reply as ReplyIcon, MoreVertical, Smile, Image as ImageIcon,
  Bell, AlertCircle, Copy, Send, CheckCircle2, Award, ChevronDown,
  ChevronUp, RefreshCw, FileText
} from 'lucide-react';
import { getArticleBySlug, getComments, createComment, getArticles } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { ArticleCard, PdfViewer } from '@/components';
import toast from 'react-hot-toast';

/* ── Custom theme colors mapping ── */
const PALETTE = {
  primary: '#7B654D',      // Elegant brown
  secondary: '#E5D8CA',    // Light beige
  background: '#FAF7F2',   // Warm off-white
  text: '#2D2A26',         // Dark text
  border: '#E8E2DA',       // Warm border
  white: '#FFFFFF',
};

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { isAuthenticated, loggedInUser } = useSelector((s) => s.auth);

  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* Comments & Form States */
  const [commentText, setCommentText] = useState('');
  const [notifyOnReplies, setNotifyOnReplies] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const commentFormRef = useRef(null);

  // Handle scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch article data on mount/slug change
  useEffect(() => {
    const loadArticleData = async () => {
      try {
        setLoading(true);
        setError(null);
        let activeSlug = slug;

        // If parameter is a 24-character ObjectID hex representation, resolve to slug
        if (/^[0-9a-fA-F]{24}$/.test(slug)) {
          const res = await getArticles({ limit: 1000 });
          const matched = res.articles?.find(a => a._id === slug);
          if (matched) {
            activeSlug = matched.slug;
          }
        }

        const data = await getArticleBySlug(activeSlug);
        setCurrent(data);

        // Fetch comments list
        try {
          const commentRes = await getComments('article', data.article._id);
          setComments(commentRes.comments || []);
          setCommentCount(commentRes.totalComments || 0);
        } catch (err) {
          console.warn("Failed to load comments", err);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    loadArticleData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: PALETTE.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: PALETTE.primary }}></div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-white border border-slate-200" dir="rtl">
        <h2 className="text-2xl font-bold font-serif" style={{ color: PALETTE.primary }}>
          مضمون لوڈ کرنے میں خرابی
        </h2>
        <p className="text-slate-500 text-sm mt-2">{error || 'مضمون نہیں ملا۔'}</p>
        <Link to="/articles" className="inline-flex items-center gap-1.5 mt-6 px-5 py-2.5 text-white rounded font-bold text-xs uppercase tracking-wider" style={{ backgroundColor: PALETTE.primary }}>
          <ArrowRight className="w-4 h-4" />
          مقالات پر واپس جائیں
        </Link>
      </div>
    );
  }

  const { article, related } = current;
  const { title, summary, category, tags, featuredImage, pdf, references, publishDate, viewCount } = article;

  const featuredImageUrl = featuredImage?.url || featuredImage || null;
  const pdfUrl = pdf?.url || (typeof pdf === 'string' ? pdf : null);

  const formattedDate = new Date(publishDate).toLocaleDateString('ur-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
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
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
      default:
        break;
    }
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('لنک کاپی ہو گیا ہے!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'مضمون محفوظ کردہ فہرست سے ہٹا دیا گیا' : 'مضمون کامیابی سے محفوظ کر لیا گیا');
  };

  const scrollToCommentForm = () => {
    commentFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const textarea = commentFormRef.current?.querySelector('textarea');
      textarea?.focus();
    }, 400);
  };

  // Submit main comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) {
      toast.error('براہ کرم کوئی تبصرہ ٹائپ کریں۔');
      return;
    }

    try {
      setSubmittingComment(true);
      const result = await createComment({
        contentType: 'article',
        contentId: article._id,
        text: commentText.trim(),
      });
      toast.success('آپ کا تبصرہ جمع کرا دیا گیا ہے۔ انتظامیہ کی منظوری کے بعد یہ ظاہر ہو جائے گا۔');
      setCommentText('');

      // Update local comments state immediately by appending the new comment
      if (result && result.data) {
        setComments((prev) => [result.data, ...prev]);
        setCommentCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Submit reply
  const handleReplySubmit = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!replyText.trim()) {
      toast.error('جواب خالی نہیں ہو سکتا۔');
      return;
    }

    try {
      const result = await createComment({
        contentType: 'article',
        contentId: article._id,
        text: replyText.trim(),
        parentComment: commentId,
      });
      toast.success('آپ کا جواب جمع کرا دیا گیا ہے اور منظوری کے بعد ظاہر ہو گا۔');
      setReplyText('');
      setReplyToId(null);

      // Update local replies array inside state immediately
      if (result && result.data) {
        setComments((prevComments) =>
          prevComments.map((c) => {
            if (c._id === commentId) {
              return {
                ...c,
                replies: [result.data, ...(c.replies || [])],
              };
            }
            return c;
          })
        );
        setCommentCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Avatar helper
  const Avatar = ({ user }) => {
    const initials = (user?.name || 'ص').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const imgUrl = typeof user?.profileImage === 'string' ? user.profileImage : user?.profileImage?.url;
    const [imgFailed, setImgFailed] = useState(false);

    if (imgUrl && !imgFailed) {
      return (
        <img
          src={imgUrl}
          alt={user.name}
          onError={() => setImgFailed(true)}
          className="w-10 h-10 rounded-full object-cover border shrink-0"
          style={{ borderColor: PALETTE.border }}
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border shadow-xs shrink-0" style={{ backgroundColor: PALETTE.primary, borderColor: PALETTE.border }}>
        {initials}
      </div>
    );
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="min-h-screen text-[#2D2A26] font-serif py-8" style={{ backgroundColor: '#F8F5F0' }} dir="rtl">

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Breadcrumb Back Button */}
        <Link to="/articles" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-2 transition-all hover:opacity-85" style={{ color: '#8B6B47' }}>
          <ArrowRight className="w-4 h-4" />
          مقالات پر واپس جائیں
        </Link>

        {/* ── Two Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* RIGHT COLUMN: Sidebar (renders on the right in RTL) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6 lg:max-w-[320px] lg:w-full">
            <div className="bg-[#FAF7F2] border-2 border-[#A78B6D] rounded-[16px] overflow-hidden shadow-xs">
              {/* Brown Header Card */}
              <div className="bg-[#8B6B47] py-3 px-4 text-center text-white font-bold text-sm leading-relaxed border-b border-[#A78B6D] font-serif">
                ✦ مضمون کی تفصیلات ✦
              </div>

              <div className="p-5 space-y-6">
                {/* 1. Statistics Section */}
                <div className="space-y-3.5">
                  {/* Views */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-bold text-slate-700">
                      <Eye className="w-4.5 h-4.5 text-[#8B6B47]" />
                      <span>مرتب دیکھا گیا</span>
                    </span>
                    <span className="text-[#8B6B47] font-extrabold text-sm">
                      {viewCount.toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-[#E7DED2]" />

                  {/* Shares */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-bold text-slate-700">
                      <RefreshCw className="w-4 h-4 text-[#8B6B47]" />
                      <span>مرتب شیئر کیا گیا</span>
                    </span>
                    <span className="text-[#8B6B47] font-extrabold text-sm">
                      86
                    </span>
                  </div>
                  <hr className="border-[#E7DED2]" />

                  {/* Date Published */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-bold text-slate-700">
                      <Calendar className="w-4.5 h-4.5 text-[#8B6B47]" />
                      <span>تاریخ اشاعت</span>
                    </span>
                    <span className="text-[#8B6B47] font-extrabold text-xs">
                      {formattedDate}
                    </span>
                  </div>
                  <hr className="border-[#E7DED2]" />

                  {/* Comments Count */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-bold text-slate-700">
                      <MessageCircle className="w-4.5 h-4.5 text-[#8B6B47]" />
                      <span>تبصرے</span>
                    </span>
                    <span className="text-[#8B6B47] font-extrabold text-sm">
                      {commentCount}
                    </span>
                  </div>
                </div>

                <hr className="border-[#A78B6D]/30 border-dashed" />

                {/* 2. Share Section */}
                <div className="space-y-3 text-center">
                  <span className="text-xs font-bold text-slate-500 block">
                    اس مضمون کو شیئر کریں
                  </span>
                  <div className="flex items-center justify-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => handleShareClick('whatsapp')}
                      className="w-9 h-9 rounded-full border border-[#E7DED2] bg-white text-slate-650 hover:bg-[#8B6B47] hover:text-white hover:border-[#8B6B47] transition-all duration-300 cursor-pointer flex items-center justify-center shadow-2xs"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    </button>
                    <button
                      onClick={() => handleShareClick('facebook')}
                      className="w-9 h-9 rounded-full border border-[#E7DED2] bg-white text-slate-650 hover:bg-[#8B6B47] hover:text-white hover:border-[#8B6B47] transition-all duration-300 cursor-pointer flex items-center justify-center shadow-2xs"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4 text-[#1877F2]" />
                    </button>
                    <button
                      onClick={() => handleShareClick('twitter')}
                      className="w-9 h-9 rounded-full border border-[#E7DED2] bg-white text-slate-650 hover:bg-[#8B6B47] hover:text-white hover:border-[#8B6B47] transition-all duration-300 cursor-pointer flex items-center justify-center shadow-2xs"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    </button>
                    <button
                      onClick={() => handleShareClick('telegram')}
                      className="w-9 h-9 rounded-full border border-[#E7DED2] bg-white text-slate-650 hover:bg-[#8B6B47] hover:text-white hover:border-[#8B6B47] transition-all duration-300 cursor-pointer flex items-center justify-center shadow-2xs"
                      title="Telegram"
                    >
                      <Send className="w-4 h-4 text-[#0088cc]" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-9 h-9 rounded-full border border-[#E7DED2] bg-white text-slate-650 hover:bg-[#8B6B47] hover:text-white hover:border-[#8B6B47] transition-all duration-300 cursor-pointer flex items-center justify-center shadow-2xs"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <hr className="border-[#A78B6D]/30 border-dashed" />

                {/* 3. Tags Section */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 block text-center">
                    ٹیگز
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tags && tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-xs font-bold px-3 py-1 bg-white border border-[#E7DED2] rounded-lg text-[#8B6B47] shadow-3xs"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <hr className="border-[#A78B6D]/30 border-dashed" />

                {/* 4. Actions Section */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 block text-center">
                    کارروائیاں
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveToggle}
                      className="flex-1 py-2 px-3 bg-white border border-[#E7DED2] hover:bg-[#FAF7F2] rounded-lg text-xs font-bold text-[#8B6B47] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#8B6B47]' : ''}`} />
                      <span>{isSaved ? 'محفوظ کردہ' : 'محفوظ کریں'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="flex-1 py-2 px-3 bg-white border border-[#E7DED2] hover:bg-[#FAF7F2] rounded-lg text-xs font-bold text-[#8B6B47] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>پرنٹ کریں</span>
                    </button>
                  </div>
                </div>

                <hr className="border-[#A78B6D]/30 border-dashed" />

                {/* 5. PDF Card */}
                <div className="rounded-xl border border-[#E7DED2] p-4 bg-white flex items-center justify-between gap-3 shadow-3xs">
                  <div className="flex-1 min-w-0">
                    {pdfUrl ? (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          پی ڈی ایف فائل دستیاب ہے
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setShowPdf(!showPdf)}
                            className="text-[10px] text-white font-bold bg-[#8B6B47] px-2.5 py-1 rounded cursor-pointer border-0 shadow-3xs"
                          >
                            {showPdf ? 'چھپائیں' : 'دیکھیں'}
                          </button>
                          <a
                            href={pdfUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#8B6B47] font-bold bg-[#FAF7F2] border border-[#E7DED2] px-2.5 py-1 rounded decoration-none cursor-pointer shadow-3xs"
                          >
                            ڈاؤن لوڈ
                          </a>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-bold block">
                        PDF فائل دستیاب نہیں ہے
                      </span>
                    )}
                  </div>
                  <FileText className="w-7 h-7 text-[#8B6B47] shrink-0" />
                </div>
              </div>
            </div>

            {/* Related Articles Card Section */}
            {related && related.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#8B6B47] border-b border-[#E7DED2] pb-2 font-serif">
                  متعلقہ مقالات
                </h3>
                <div className="space-y-4">
                  {related.slice(0, 3).map((rel) => (
                    <ArticleCard key={rel._id} article={rel} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LEFT COLUMN: Main Content Area (renders on the left in RTL) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#E7DED2] rounded-[16px] shadow-sm overflow-hidden">

              {/* 1. Hero Section */}
              <div className="h-[380px] w-full bg-slate-100 relative">
                <img
                  src={featuredImageUrl || placeholderImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />

                {/* Floating Bookmark button floating top-right */}
                <button
                  onClick={handleSaveToggle}
                  className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm text-[#8B6B47] border border-[#E7DED2] hover:bg-slate-50 transition-all cursor-pointer z-10"
                  title={isSaved ? "محفوظ کردہ فہرست سے ہٹائیں" : "محفوظ کریں"}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#8B6B47]' : ''}`} />
                </button>

                {/* Floating Category badge top-left */}
                <div className="absolute top-4 left-4 bg-[#8B6B47] text-white text-xs font-bold px-3 py-1.5 rounded-full border border-[#B89B7A] shadow-md z-10">
                  {category?.name || category || 'مقالہ'}
                </div>
              </div>

              {/* Unified inner content */}
              <div className="p-6 sm:p-8 space-y-8">

                {/* 2. Meta Information Bar */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-550 py-3 border-b border-[#E7DED2] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#8B6B47]" />
                    <span>تاریخ اشاعت: {formattedDate}</span>
                  </span>
                  <span className="text-[#E7DED2] font-normal">|</span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#8B6B47]" />
                    <span>{commentCount} تبصرے</span>
                  </span>
                  <span className="text-[#E7DED2] font-normal">|</span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#8B6B47]" />
                    <span>{viewCount} مرتبہ دیکھا گیا</span>
                  </span>
                  <span className="text-[#E7DED2] font-normal">|</span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#8B6B47]" />
                    <span>کتاب</span>
                  </span>
                </div>

                {/* 3. Article Title Section */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-xl lg:text-[32px] font-extrabold leading-snug tracking-tight text-[#8B6B47] font-serif">
                    {title}
                  </h1>
                </div>

                {/* 4. Subtitle Excerpt Section */}
                {summary && (
                  <div className="text-center mt-10 border p-8  rounded-lg border-[#E7DED2] pb-10">
                    <p className="text-slate-650 text-lg sm:text-[22px] leading-relaxed  mx-auto italic font-medium">
                      {summary}
                    </p>
                  </div>
                )}

                {/* 5. Article Content */}
                <div
                  className="prose max-w-none text-[#2D2A26] text-base leading-[1.9] space-y-6 font-serif pt-4 border-t border-[#E7DED2]/50"
                  dangerouslySetInnerHTML={{ __html: article.content || article.text || '' }}
                />



                {/* Embedded PDF container */}
                {showPdf && pdfUrl && (
                  <div className="pt-6 border-t border-[#E7DED2]">
                    <div className="w-full rounded-xl overflow-hidden border bg-white" style={{ borderColor: '#E7DED2' }}>
                      <PdfViewer url={pdfUrl} title={title} />
                    </div>
                  </div>
                )}

                {/* 6. Comment Section (Instagram + YouTube combination style) */}
                <div className="pt-8 border-t border-[#E7DED2]">

                  {/* Comment Input Card */}
                  <div className="bg-[#FAF8F5] border border-[#E7DED2] rounded-[20px] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
                    <h3 className="text-sm font-extrabold text-[#8B6B47] mb-3">تبصرہ کریں</h3>
                    {!isAuthenticated ? (
                      <div className="text-center py-4">
                        <p className="text-xs font-bold text-slate-600 mb-3">تبصرہ کرنے کے لیے آپ کا سائن ان ہونا ضروری ہے۔</p>
                        <button
                          onClick={() => navigate('/login')}
                          className="px-5 py-2 text-white font-bold text-xs rounded-lg cursor-pointer border-0 shadow-3xs"
                          style={{ backgroundColor: '#8B6B47' }}
                        >
                          لاگ ان کریں
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <div className="flex gap-3 items-start">
                          <Avatar user={loggedInUser} size="md" />
                          <div className="flex-1 border border-[#E7DED2] rounded-xl p-3 bg-white focus-within:border-[#8B6B47] transition-colors shadow-2xs">
                            <textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="اپنا تبصرہ یہاں لکھیں..."
                              rows={3}
                              className="w-full resize-none border-0 outline-none focus:ring-0 text-sm bg-transparent font-serif"
                            />
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-2 text-slate-400">
                                <button type="button" className="hover:text-slate-600 transition-colors p-1 bg-transparent border-0 cursor-pointer" title="تصویر">
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                                <button type="button" className="hover:text-slate-600 transition-colors p-1 bg-transparent border-0 cursor-pointer" title="ایموجی">
                                  <Smile className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                type="submit"
                                disabled={submittingComment || !commentText.trim()}
                                className="px-5 py-2 text-white font-bold text-xs rounded-lg transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer border-0 bg-[#8B6B47] hover:bg-[#725739] shadow-3xs"
                              >
                                <span>تبصرہ بھیجیں</span>
                                <Send className="w-3.5 h-3.5 rotate-180" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Comments Timeline */}
                  <div className="mt-6 border-t border-[#E7DED2]/60 pt-6">
                    {comments.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 font-bold border border-dashed rounded-xl" style={{ borderColor: '#E7DED2' }}>
                        ابھی تک کوئی تبصرہ نہیں ہے۔ پہلا تبصرہ آپ کریں۔
                      </div>
                    ) : (
                      <div className="space-y-6 relative max-h-[600px] overflow-y-auto pr-4 pl-2">
                        {/* Vertical Timeline Line on the Right (RTL aligned) */}
                        <div className="absolute right-[16px] top-4 bottom-4 w-0.5 bg-[#E7DED2] z-0" />

                        {comments.map((comment, index) => (
                          <div key={comment._id} className="relative z-10 space-y-3">

                            {/* Timeline dot aligned to the right */}
                            {index === 0 ? (
                              <div className="absolute right-[5px] top-4 w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#8B6B47] flex items-center justify-center z-10 shadow-xs">
                                <Smile className="w-3.5 h-3.5 text-[#8B6B47]" />
                              </div>
                            ) : (
                              <div className="absolute right-[13.5px] top-5 w-[7px] h-[7px] rounded-full bg-[#8B6B47] border border-white z-10 shadow-3xs" />
                            )}

                            {/* Comment Card Design (Premium styled with right margin spacing to clear timeline) */}
                            <div className="rounded-[16px] border border-[#E7DED2] p-4.5 shadow-2xs hover:shadow-xs hover:border-[#8B6B47]/30 transition-all duration-300 bg-white mr-8">
                              <div className="flex gap-3 items-start">
                                <Avatar user={comment.user} />

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-bold text-slate-800 ml-1">
                                        {comment.user?.name || 'صارف'}
                                      </span>
                                      {/* Verified badge support */}
                                      {comment.user?.isVerified && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                                      )}
                                      <span className="text-[10px] text-slate-400 font-bold">
                                        {new Date(comment.createdAt).toLocaleDateString('ur-PK')}
                                      </span>
                                    </div>

                                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-0 cursor-pointer">
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <p className="text-sm text-slate-700 leading-relaxed font-serif font-medium">
                                    {comment.text}
                                  </p>

                                  {/* Comment Actions: Like, Reply, Share, Report */}
                                  <div className="flex items-center gap-4 mt-3.5 text-xs text-slate-500 font-bold border-t border-[#E7DED2]/40 pt-2.5">
                                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer">
                                      <Heart className="w-3.5 h-3.5 text-slate-450 hover:text-red-500 hover:fill-red-500" />
                                      <span className="text-slate-600 font-bold">{(comment.likes || (index * 7 + 3) % 25 + 1)}</span>
                                    </button>

                                    <button
                                      onClick={() => setReplyToId(replyToId === comment._id ? null : comment._id)}
                                      className="flex items-center gap-1 hover:text-blue-900 transition-colors bg-transparent border-0 cursor-pointer"
                                    >
                                      <ReplyIcon className="w-3.5 h-3.5 text-slate-455" />
                                      <span>جواب دیں</span>
                                    </button>

                                    <button className="hover:text-slate-800 transition-colors bg-transparent border-0 cursor-pointer">
                                      شیئر کریں
                                    </button>

                                    <button className="mr-auto text-[10px] text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider bg-transparent border-0 cursor-pointer">
                                      رپورٹ کریں
                                    </button>
                                  </div>

                                  {/* Reply Composer box */}
                                  {replyToId === comment._id && (
                                    <div className="mt-3 bg-[#FAF8F5] border border-[#E7DED2] p-3 rounded-lg space-y-2">
                                      <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="اپنا جواب ٹائپ کریں..."
                                        rows={2}
                                        className="w-full p-2 border border-[#E7DED2] rounded-md outline-none text-xs bg-white resize-none"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <button
                                          onClick={() => setReplyToId(null)}
                                          className="px-3 py-1 text-xs text-slate-500 font-bold bg-transparent border-0 cursor-pointer"
                                        >
                                          منسوخ کریں
                                        </button>
                                        <button
                                          onClick={() => handleReplySubmit(comment._id)}
                                          className="px-4 py-1.5 text-white font-bold text-xs rounded bg-[#8B6B47] hover:bg-[#725739] cursor-pointer border-0 shadow-3xs"
                                        >
                                          پوسٹ کریں
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Replies List */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mr-8 ml-0 pr-6 space-y-3 relative">
                                {/* Thread connector line for nested replies on right */}
                                <div className="absolute right-[-16px] top-0 bottom-4 w-0.5 bg-[#E7DED2]/80" />

                                {comment.replies.map((reply) => (
                                  <div key={reply._id} className="relative z-10">
                                    {/* Connector dot */}
                                    <div className="absolute right-[-18.5px] top-5 w-[5px] h-[5px] rounded-full bg-[#8B6B47]/60 border border-white" />

                                    <div className="rounded-[16px] border border-[#E7DED2] p-4 shadow-2xs hover:shadow-xs transition-shadow bg-[#FAF8F5] mr-8">
                                      <div className="flex gap-3 items-start">
                                        <Avatar user={reply.user} />

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs font-bold text-slate-800 ml-2">
                                                {reply.user?.name || 'صارف'}
                                              </span>
                                              <span className="text-[9px] text-slate-450 font-bold">
                                                {new Date(reply.createdAt).toLocaleDateString('ur-PK')}
                                              </span>
                                            </div>

                                            <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-0 cursor-pointer">
                                              <MoreVertical className="w-3.5 h-3.5" />
                                            </button>
                                          </div>

                                          <p className="text-xs text-slate-700 leading-relaxed font-serif font-medium">
                                            {reply.text}
                                          </p>

                                          {/* Actions for replies */}
                                          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-bold border-t border-[#E7DED2]/45 pt-1.5">
                                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer">
                                              <Heart className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                              <span className="text-slate-600 font-bold">{(reply.text.length * 3) % 15 + 1}</span>
                                            </button>
                                            <button
                                              onClick={() => setReplyToId(comment._id)}
                                              className="flex items-center gap-1 hover:text-blue-900 transition-colors bg-transparent border-0 cursor-pointer"
                                            >
                                              <ReplyIcon className="w-3 h-3" />
                                              <span>جواب دیں</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        ))}

                        {/* Centered Load More comments button */}
                        <div className="pt-4 mr-8 flex justify-center">
                          <button className="px-6 py-2.5 bg-[#FAF7F2] border border-[#E7DED2] hover:bg-[#B89B7A]/20 text-[#8B6B47] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-3xs">
                            <span>مزید تبصرے لوڈ کریں</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
