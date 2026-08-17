import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Heart,
  Reply as ReplyIcon,
  Smile,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Flame,
  ThumbsUp
} from 'lucide-react';
import { getComments, createComment } from '@/services';
import { COLORS } from '@/utils/themeColors';
import toast from 'react-hot-toast';

/* ─── Instagram-Style Gradient Story Avatar ─── */
function InstagramAvatar({ user, size = 'md' }) {
  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const imgUrl =
    typeof user?.profileImage === 'string'
      ? user.profileImage
      : user?.profileImage?.url;

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  }[size] || 'w-9 h-9 text-xs';

  return (
    <div className="relative shrink-0 p-[1.5px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xs">
      <div className="bg-white rounded-full p-[1px]">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={user?.name || 'User'}
            className={`${sizeClasses} rounded-full object-cover`}
          />
        ) : (
          <div
            style={{ backgroundColor: COLORS.primary }}
            className={`${sizeClasses} rounded-full flex items-center justify-center text-white font-bold`}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentsSection({ contentType, contentId, language = 'ur' }) {
  const navigate = useNavigate();
  const { isAuthenticated, loggedInUser } = useSelector((s) => s.auth);

  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedComments, setLikedComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [activeTab, setActiveTab] = useState('newest'); // 'newest' | 'popular'

  const isRTL = language === 'ur' || language === 'Urdu';

  const t = {
    en: {
      comments: 'Comments',
      placeholder: 'Add a comment...',
      replyPlaceholder: 'Reply to',
      post: 'Post',
      reply: 'Reply',
      viewReplies: 'View replies',
      hideReplies: 'Hide replies',
      loginRequired: 'Sign in to join the conversation',
      loginBtn: 'Sign In',
      noComments: 'No comments yet. Be the first to start the discussion!',
      emptyAlert: 'Comment cannot be empty.',
      successToast: 'Comment posted successfully!',
      approvedNotice: 'Comment will be visible once reviewed by admin.',
      popular: 'Top Comments',
      newest: 'Latest',
    },
    ur: {
      comments: 'تبصرے و آراء',
      placeholder: 'اپنی رائے یا تبصرہ لکھیں...',
      replyPlaceholder: 'کو جواب دیں',
      post: 'شائع کریں',
      reply: 'جواب دیں',
      viewReplies: 'جوابات دیکھیں',
      hideReplies: 'جوابات چھپائیں',
      loginRequired: 'تبصرہ کرنے کے لیے سائن ان کریں',
      loginBtn: 'سائن ان کریں',
      noComments: 'ابھی تک کوئی تبصرہ نہیں ہے۔ پہلا مبارک تبصرہ آپ تحریر کریں!',
      emptyAlert: 'براہ کرم کوئی تبصرہ تحریر کریں۔',
      successToast: 'تبصرہ کامیابی سے جمع ہو گیا!',
      approvedNotice: 'تبصرہ انتظامیہ کی منظوری کے بعد ظاہر ہوگا۔',
      popular: 'مشہور تبصرے',
      newest: 'تازہ ترین',
    },
  }[isRTL ? 'ur' : 'en'];

  const quickEmojis = ['❤️', '🤲', '👏', '💡', '💯', '🔥', '🌸', '✨'];

  useEffect(() => {
    let active = true;
    const fetchCommentsList = async () => {
      try {
        setLoading(true);
        const res = await getComments(contentType, contentId);
        if (active) {
          setComments(res.comments || []);
          setTotal(res.totalComments || (res.comments || []).length);
        }
      } catch (err) {
        console.warn('Failed to load comments', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (contentType && contentId) {
      fetchCommentsList();
    }
    return () => {
      active = false;
    };
  }, [contentType, contentId]);

  const handleLike = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAddEmoji = (emoji) => {
    if (replyingTo) {
      setReplyText((prev) => prev + emoji);
    } else {
      setText((prev) => prev + emoji);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!text.trim()) {
      toast.error(t.emptyAlert);
      return;
    }

    try {
      setSubmitting(true);
      await createComment({
        contentType,
        contentId,
        text: text.trim(),
      });
      toast.success(t.successToast);
      setText('');
      const res = await getComments(contentType, contentId);
      setComments(res.comments || []);
      setTotal(res.totalComments || (res.comments || []).length);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!replyText.trim()) {
      toast.error(t.emptyAlert);
      return;
    }

    try {
      setSubmitting(true);
      await createComment({
        contentType,
        contentId,
        text: replyText.trim(),
        parentId,
      });
      toast.success(t.successToast);
      setReplyText('');
      setReplyingTo(null);
      const res = await getComments(contentType, contentId);
      setComments(res.comments || []);
      setTotal(res.totalComments || (res.comments || []).length);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return isRTL ? 'ابھی' : 'just now';
    if (diffMins < 60) return isRTL ? `${diffMins} منٹ پہلے` : `${diffMins}m`;
    if (diffHours < 24) return isRTL ? `${diffHours} گھنٹے پہلے` : `${diffHours}h`;
    if (diffDays < 7) return isRTL ? `${diffDays} دن پہلے` : `${diffDays}d`;
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ur-PK' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
      {/* ── Header Toolbar ── */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
            style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif" style={{ color: COLORS.primary }}>
              {t.comments}
            </h3>
            <span className="text-xs font-semibold" style={{ color: COLORS.textSecondary }}>
              {total} {isRTL ? 'تبصرے شامل ہیں' : 'comments'}
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50 text-xs font-bold" style={{ borderColor: COLORS.border }}>
          <button
            type="button"
            onClick={() => setActiveTab('newest')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'newest' ? 'bg-white shadow-xs text-primary' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.newest}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('popular')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'popular' ? 'bg-white shadow-xs text-primary' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.popular}
          </button>
        </div>
      </div>

      {/* ── Instagram-Style Input Card (Top or Inline) ── */}
      <div
        className="rounded-2xl border p-4 shadow-sm transition-all focus-within:shadow-md"
        style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
      >
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-start gap-3">
              <InstagramAvatar user={loggedInUser} size="md" />
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full resize-none bg-slate-50 border rounded-xl p-3 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-amber-600"
                  style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
                />
              </div>
            </div>

            {/* Quick Emoji Reaction Bar + Post Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleAddEmoji(emoji)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 transition-transform hover:scale-125 flex items-center justify-center text-sm cursor-pointer select-none"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? '...' : t.post}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Smile className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium" style={{ color: COLORS.textSecondary }}>
                {t.loginRequired}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              {t.loginBtn}
            </button>
          </div>
        )}
      </div>

      {/* ── Comments List ── */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }} />
          <span className="text-xs text-slate-400">{isRTL ? 'تبصرے لوڈ ہو رہے ہیں...' : 'Loading comments...'}</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((cmt) => {
            const isLiked = !!likedComments[cmt._id];
            const isReplying = replyingTo === cmt._id;
            const replies = cmt.replies || [];
            const showReplies = !!expandedReplies[cmt._id];

            return (
              <div
                key={cmt._id}
                className="rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-sm"
                style={{ backgroundColor: COLORS.white, borderColor: `${COLORS.border}90` }}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left (Avatar & Body) */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <InstagramAvatar user={cmt.user} size="md" />
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Name & Time */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold truncate" style={{ color: COLORS.primary }}>
                          {cmt.user?.name || 'صارف'}
                        </span>
                        {cmt.user?.role === 'admin' && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>مفتی/انتظامیہ</span>
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          • {formatTimeAgo(cmt.createdAt)}
                        </span>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line pt-0.5" style={{ color: COLORS.textPrimary }}>
                        {cmt.text}
                      </p>

                      {/* Action buttons (Reply & Replies toggle) */}
                      <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-slate-500">
                        <button
                          type="button"
                          onClick={() => setReplyingTo(isReplying ? null : cmt._id)}
                          className="hover:text-primary transition-colors cursor-pointer"
                        >
                          {t.reply}
                        </button>

                        {replies.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedReplies((prev) => ({
                                ...prev,
                                [cmt._id]: !prev[cmt._id],
                              }))
                            }
                            className="inline-flex items-center gap-1 font-bold text-accent hover:underline cursor-pointer"
                          >
                            <span>
                              {showReplies ? t.hideReplies : `${t.viewReplies} (${replies.length})`}
                            </span>
                            {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Heart Like Button */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLike(cmt._id)}
                      className={`p-1.5 rounded-full transition-transform active:scale-125 cursor-pointer ${
                        isLiked ? 'text-red-550' : 'text-slate-400 hover:text-red-500'
                      }`}
                      aria-label="Like comment"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(cmt.likeCount || 0) + (isLiked ? 1 : 0)}
                    </span>
                  </div>
                </div>

                {/* Inline Reply Form */}
                {isReplying && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, cmt._id)}
                    className="mt-4 pt-3 border-t border-slate-100 ps-12 space-y-2 animate-fade-in"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`${t.replyPlaceholder} @${cmt.user?.name || 'User'}...`}
                        className="flex-1 text-xs bg-slate-50 border rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600"
                        style={{ borderColor: COLORS.border }}
                      />
                      <button
                        type="submit"
                        disabled={submitting || !replyText.trim()}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs disabled:opacity-40 cursor-pointer"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        {t.post}
                      </button>
                    </div>
                  </form>
                )}

                {/* Nested Replies Thread */}
                {showReplies && replies.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-dashed ps-10 sm:ps-12 space-y-3" style={{ borderColor: `${COLORS.border}70` }}>
                    {replies.map((rep) => (
                      <div key={rep._id} className="flex items-start gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <InstagramAvatar user={rep.user} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: COLORS.primary }}>
                              {rep.user?.name || 'صارف'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              • {formatTimeAgo(rep.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed pt-0.5" style={{ color: COLORS.textPrimary }}>
                            {rep.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="text-center py-12 rounded-3xl border border-dashed flex flex-col items-center justify-center p-6 space-y-3"
          style={{ backgroundColor: `${COLORS.background}50`, borderColor: COLORS.border }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xs"
            style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.accent }}
          >
            <Sparkles className="w-7 h-7" />
          </div>
          <h4 className="text-sm sm:text-base font-bold font-serif" style={{ color: COLORS.primary }}>
            {t.noComments}
          </h4>
          <p className="text-xs max-w-sm" style={{ color: COLORS.textSecondary }}>
            {isRTL
              ? 'اپنے خیالات، سوالات اور تاثرات کا اظہار فرمائیں اور علمی تبادلہ خیال کا حصہ بنیں۔'
              : 'Share your thoughts, reflections, and insights with the community.'}
          </p>
        </div>
      )}
    </div>
  );
}
