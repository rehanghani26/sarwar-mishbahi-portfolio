import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Calendar, Eye, ArrowRight, ArrowLeft, Bookmark, Hash, Share2,
  Facebook, Twitter, MessageCircle, ExternalLink, Download, Printer,
  Heart, Reply as ReplyIcon, MoreVertical, Smile, Image as ImageIcon,
  Bell, AlertCircle, Copy, Send, CheckCircle2, Award
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
      navigate('/admin/login');
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
      navigate('/admin/login');
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
    <div className="min-h-screen text-[#2D2A26] font-serif py-8" style={{ backgroundColor: PALETTE.background }} dir="rtl">

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-slate-200">
        <div className="h-full transition-all duration-100" style={{ width: `${scrollProgress}%`, backgroundColor: PALETTE.primary }} />
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-6">

        {/* Breadcrumb Back Button */}
        <Link to="/articles" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-2 transition-all hover:opacity-80" style={{ color: PALETTE.primary }}>
          <ArrowRight className="w-4 h-4" />
          مقالات پر واپس جائیں
        </Link>

        {/* ── UNIFIED MAIN ARTICLE CARD (Single Card Layout) ── */}
        <article className="bg-white border rounded-2xl shadow-xs overflow-hidden" style={{ borderColor: PALETTE.border }}>

          {/* Header image (Compact size) */}
          <div className="h-[200px] sm:h-[280px] w-full bg-slate-100 relative">
            <img
              src={featuredImageUrl || placeholderImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Category tag overlay */}
            <div className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded" style={{ backgroundColor: PALETTE.primary }}>
              {category}
            </div>

            {/* Save toggle icon overlay */}
            <button
              onClick={handleSaveToggle}
              className="absolute top-4 left-4 p-2 bg-white/95 rounded-full shadow-xs text-[#2D2A26] border hover:bg-slate-50 transition-all cursor-pointer"
              title={isSaved ? "محفوظ کردہ فہرست سے ہٹائیں" : "محفوظ کریں"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 stroke-amber-600' : ''}`} />
            </button>
          </div>

          <div className="p-6 sm:p-10 space-y-6">

            {/* Article Top Stats bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pb-4 border-b" style={{ borderColor: PALETTE.border }}>
              <div className="flex flex-wrap items-center gap-5">
                <span className="flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5" style={{ color: PALETTE.primary }} />
                  تاریخ اشاعت: {formattedDate}
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <Eye className="w-3.5 h-3.5" style={{ color: PALETTE.primary }} />
                  دیکھی گئی: {viewCount} بار
                </span>
              </div>

              {/* Scroll comment click action */}
              <button
                onClick={scrollToCommentForm}
                className="flex items-center gap-1.5 font-bold hover:underline cursor-pointer border-0 bg-transparent text-slate-500 p-0"
              >
                <MessageCircle className="w-3.5 h-3.5" style={{ color: PALETTE.primary }} />
                تبصرے: {commentCount} (تبصرہ کریں)
              </button>
            </div>

            {/* Article Title & Summary */}
            <div className="text-right">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug tracking-tight" style={{ color: PALETTE.primary }}>
                {title}
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic mt-4 border-r-4 pr-3" style={{ borderRightColor: PALETTE.primary }}>
                {summary}
              </p>
            </div>

            {/* Action Toolbar section */}
            <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: PALETTE.border }}>
              <div className="flex items-center gap-2.5 flex-wrap">
                {pdfUrl ? (
                  <>
                    <button
                      onClick={() => setShowPdf(!showPdf)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-white rounded text-xs font-bold transition-all cursor-pointer border-0"
                      style={{ backgroundColor: PALETTE.primary }}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#E5D8CA]" />
                      {showPdf ? 'پی ڈی ایف چھپائیں' : 'پی ڈی ایف دیکھیں'}
                    </button>
                    <a
                      href={pdfUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold border transition-colors bg-[#E5D8CA] text-[#7B654D]"
                      style={{ borderColor: PALETTE.border }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      ڈاؤن لوڈ کریں
                    </a>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 italic font-bold">پی ڈی ایف فائل دستیاب نہیں ہے</span>
                )}

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-bold transition-all border"
                  style={{ borderColor: PALETTE.border }}
                >
                  <Printer className="w-3.5 h-3.5" style={{ color: PALETTE.primary }} />
                  پرنٹ کریں
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToggle}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-55 rounded text-xs font-bold border transition-all hover:bg-slate-100 cursor-pointer"
                  style={{ borderColor: PALETTE.border }}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 stroke-amber-600' : ''}`} style={{ color: PALETTE.primary }} />
                  {isSaved ? 'محفوظ کردہ' : 'محفوظ کریں'}
                </button>
              </div>
            </div>

            {/* Embedded PDF container */}
            {showPdf && pdfUrl && (
              <div className="w-full mt-4 rounded-xl overflow-hidden border" style={{ borderColor: PALETTE.border }}>
                <PdfViewer url={pdfUrl} title={title} />
              </div>
            )}

            {/* References Card */}
            {references && references.length > 0 && (
              <div className="pt-6 border-t" style={{ borderColor: PALETTE.border }}>
                <div className="rounded-xl border p-4 sm:p-5 bg-slate-50/50" style={{ borderColor: PALETTE.border }}>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: PALETTE.primary }}>
                    <Bookmark className="w-4.5 h-4.5" />
                    حوالہ جات / مراجع
                  </h3>
                  <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-800 space-y-1.5 font-bold">
                    {references.map((ref, idx) => (
                      <li key={idx} className="font-bold">{ref}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Tags & Social sharing row inside card */}
            <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-5" style={{ borderColor: PALETTE.border }}>

              {/* Tags block */}
              <div className="flex flex-wrap gap-1.5">
                {tags && tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-slate-50 border rounded text-slate-600"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <Hash className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Share box */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
                  <Share2 className="w-4 h-4" style={{ color: PALETTE.primary }} />
                  اس مضمون کو شیئر کریں:
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleShareClick('whatsapp')}
                    className="p-2.5 rounded-full border bg-slate-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                    title="WhatsApp"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShareClick('facebook')}
                    className="p-2.5 rounded-full border bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                    title="Facebook"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShareClick('twitter')}
                    className="p-2.5 rounded-full border bg-slate-50 text-sky-650 hover:bg-sky-650 hover:text-white transition-colors cursor-pointer"
                    title="Twitter"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShareClick('telegram')}
                    className="p-2.5 rounded-full border bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                    title="Telegram"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2.5 rounded-full border bg-slate-50 text-slate-700 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                    title="Copy Link"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </article>

        {/* ── 2. COMMENT FORM SECTION (Full Width) ── */}
        <div ref={commentFormRef} className="bg-white border rounded-2xl p-6 shadow-xs" style={{ borderColor: PALETTE.border }}>
          <h3 className="text-base font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: PALETTE.primary }}>
            <MessageCircle className="w-4.5 h-4.5" />
            تبصرہ شامل کریں
          </h3>

          {!isAuthenticated ? (
            <div className="bg-slate-50 border border-dashed p-6 text-center rounded-xl" style={{ borderColor: PALETTE.border }}>
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 mb-4">تبصرہ کرنے کے لیے آپ کا سائن ان ہونا ضروری ہے۔</p>
              <button
                onClick={() => navigate('/admin/login')}
                className="px-6 py-2 text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer border-0"
                style={{ backgroundColor: PALETTE.primary }}
              >
                لاگ ان کریں
              </button>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="flex gap-3 items-start">
                <Avatar user={loggedInUser} />

                <div className="flex-1 space-y-3">
                  <div className="relative">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="اپنا تبصرہ لکھیں..."
                      rows={3}
                      className="w-full p-3 border rounded-lg outline-none text-sm font-medium focus:border-stone-500 transition-colors"
                      style={{ borderColor: PALETTE.border }}
                    />

                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 text-slate-400">
                      <button type="button" className="hover:text-slate-650 transition-colors p-1" title="ایموجی">
                        <Smile className="w-4 h-4" />
                      </button>
                      <button type="button" className="hover:text-slate-655 transition-colors p-1" title="تصویر">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifyOnReplies}
                        onChange={(e) => setNotifyOnReplies(e.target.checked)}
                        className="rounded accent-stone-700"
                      />
                      <Bell className="w-3.5 h-3.5" style={{ color: PALETTE.primary }} />
                      جوابات کی اطلاع دیں
                    </label>

                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="px-5 py-2 text-white font-bold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer border-0"
                      style={{ backgroundColor: PALETTE.primary }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      تبصرہ بھیجیں
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* ── 3. COMMENTS LIST SECTION (Full Width, No Accordion) ── */}
        <div className="bg-white border rounded-2xl p-6 shadow-xs" style={{ borderColor: PALETTE.border }}>
          <div className="border-b pb-3 mb-4" style={{ borderColor: PALETTE.border }}>
            <h3 className="text-base font-bold uppercase tracking-wider" style={{ color: PALETTE.primary }}>
              تمام تبصرے ({comments.length})
            </h3>
          </div>

          {comments.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold border border-dashed rounded-xl" style={{ borderColor: PALETTE.border }}>
              ابھی تک کوئی تبصرہ نہیں ہے۔ پہلا تبصرہ آپ کریں۔
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-xl border p-4 shadow-2xs hover:shadow-xs transition-shadow bg-white"
                  style={{ borderColor: PALETTE.border }}
                >
                  <div className="flex gap-3">
                    <Avatar user={comment.user} />

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <div>
                          <span className="text-sm font-bold text-slate-800 ml-2">
                            {comment.user?.name || 'صارف'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(comment.createdAt).toLocaleDateString('ur-PK')}
                          </span>
                        </div>

                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {comment.text}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-500 font-bold border-t pt-2" style={{ borderColor: PALETTE.border }}>
                        <button className="flex items-center gap-1 hover:text-red-650 transition-colors bg-transparent border-0 cursor-pointer">
                          <Heart className="w-3.5 h-3.5" />
                          <span>پسند کریں</span>
                        </button>

                        <button
                          onClick={() => setReplyToId(replyToId === comment._id ? null : comment._id)}
                          className="flex items-center gap-1 hover:text-blue-900 transition-colors bg-transparent border-0 cursor-pointer"
                        >
                          <ReplyIcon className="w-3.5 h-3.5" />
                          <span>جواب دیں</span>
                        </button>

                        <button className="mr-auto text-[10px] hover:text-amber-700 transition-colors uppercase tracking-wider bg-transparent border-0 cursor-pointer">
                          رپورٹ کریں
                        </button>
                      </div>

                      {/* Reply Form */}
                      {replyToId === comment._id && (
                        <div className="mt-3 bg-slate-50 border p-3 rounded-lg" style={{ borderColor: PALETTE.border }}>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="اپنا جواب ٹائپ کریں..."
                            rows={2}
                            className="w-full p-2 border rounded-md outline-none text-xs bg-white"
                            style={{ borderColor: PALETTE.border }}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => setReplyToId(null)}
                              className="px-3 py-1 text-xs text-slate-500 font-bold uppercase cursor-pointer"
                            >
                              منسوخ کریں
                            </button>
                            <button
                              onClick={() => handleReplySubmit(comment._id)}
                              className="px-4 py-1.5 text-white font-bold text-xs uppercase rounded cursor-pointer border-0"
                              style={{ backgroundColor: PALETTE.primary }}
                            >
                              پوسٹ کریں
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies List */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 mr-4 pr-3 border-r-2 space-y-3" style={{ borderRightColor: PALETTE.border }}>
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="flex gap-2.5">
                              <div className="flex-1">
                                <div className="mb-0.5">
                                  <span className="text-xs font-bold text-slate-800 ml-2">
                                    {reply.user?.name || 'صارف'}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-bold">
                                    {new Date(reply.createdAt).toLocaleDateString('ur-PK')}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                  {reply.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 4. Related Articles Section ── */}
        {related && related.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold font-serif mb-4 pb-2 border-b-2" style={{ color: PALETTE.primary, borderColor: PALETTE.border }}>
              متعلقہ مقالات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.slice(0, 6).map((rel) => (
                <ArticleCard key={rel._id} article={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
