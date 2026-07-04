import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ShieldAlert, CheckCircle2, Clock, ChevronDown, ChevronUp, Reply } from 'lucide-react';
import { getComments, createComment } from '@/services';
import { COLORS } from '@/utils/themeColors';
import toast from 'react-hot-toast';

function Avatar({ user, size = 'sm' }) {
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const imgUrl = typeof user?.profileImage === 'string' ? user.profileImage : user?.profileImage?.url;
  const sz = size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs';

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={user?.name || 'User'}
        className={`${sz} rounded-full object-cover border border-slate-350 shrink-0`}
      />
    );
  }
  return (
    <div
      style={{ backgroundColor: COLORS.primary }}
      className={`${sz} rounded-full border border-slate-350 flex items-center justify-center text-white font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function CommentsSection({ contentType, contentId, language }) {
  const navigate = useNavigate();
  const { isAuthenticated, loggedInUser } = useSelector((s) => s.auth);

  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const lang = language === 'ur' ? 'ur' : 'en';

  const t = {
    en: {
      comments: "Comments",
      placeholder: "Add a public comment...",
      submit: "Comment",
      cancel: "Cancel",
      loginRequired: "You must be signed in to comment.",
      loginBtn: "Sign In",
      noComments: "No comments yet. Be the first to comment!",
      approvedNotice: "Comment will be visible once approved by admin.",
      emptyAlert: "Comment cannot be empty.",
      successToast: "Comment submitted! Awaiting administrator approval.",
      loadingText: "Loading comments...",
      replyTo: "Reply",
      showReplies: "Show replies",
      hideReplies: "Hide replies",
      expandBtn: "View all comments",
      collapseBtn: "Collapse comments",
      previewText: "Write or view comments..."
    },
    ur: {
      comments: "تبصرے",
      placeholder: "ایک عوامی تبصرہ شامل کریں...",
      submit: "تبصرہ کریں",
      cancel: "منسوخ کریں",
      loginRequired: "تبصرہ کرنے کے لیے آپ کا سائن ان ہونا ضروری ہے۔",
      loginBtn: "سائن ان کریں",
      noComments: "ابھی تک کوئی تبصرہ نہیں ہے۔ پہلا تبصرہ آپ کریں!",
      approvedNotice: "تبصرہ انتظامیہ کی منظوری کے بعد ظاہر ہوگا۔",
      emptyAlert: "تبصرہ خالی نہیں ہو سکتا۔",
      successToast: "تبصرہ جمع کر دیا گیا! منظوری کا انتظار ہے۔",
      loadingText: "تبصرے لوڈ ہو رہے ہیں...",
      replyTo: "جواب دیں",
      showReplies: "جوابات دکھائیں",
      hideReplies: "جوابات چھپائیں",
      expandBtn: "تمام تبصرے دیکھیں",
      collapseBtn: "تبصرے بند کریں",
      previewText: "تبصرے لکھیں یا دیکھیں..."
    }
  }[lang];

  useEffect(() => {
    let active = true;
    const fetchCommentsList = async () => {
      try {
        setLoading(true);
        const res = await getComments(contentType, contentId);
        if (active) {
          setComments(res.comments || []);
          setTotal(res.totalComments || 0);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
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

  const handleInputFocus = () => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/admin/login');
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
      setTotal(res.totalComments || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Get first comment text as a preview
  const firstComment = comments[0];

  return (
    <div style={{ borderColor: COLORS.border }} className="my-8 border-2 bg-white">
      
      {/* ── YouTube Style Header Accordion Bar ── */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ backgroundColor: COLORS.background }}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5" style={{ color: COLORS.primary }} />
          <div>
            <span className="font-bold text-sm text-slate-800 uppercase tracking-wider">
              {t.comments} <span className="text-slate-500 font-normal">({total})</span>
            </span>
            {/* Show first comment preview inline if collapsed */}
            {!isExpanded && firstComment && (
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 max-w-[280px] sm:max-w-[480px]">
                <span className="font-bold">{firstComment.user?.name}:</span> {firstComment.text}
              </p>
            )}
            {!isExpanded && !firstComment && (
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                {t.previewText}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            {isExpanded ? t.collapseBtn : t.expandBtn}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-900" /> : <ChevronDown className="w-4 h-4 text-blue-900" />}
        </div>
      </div>

      {/* ── Expanded Content Area ── */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-slate-200 space-y-6">

          {/* Form */}
          <div className="bg-slate-50 border border-slate-200 p-4">
            {!isAuthenticated ? (
              <div className="text-center py-2 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-xs font-bold text-slate-600">{t.loginRequired}</span>
                <button
                  onClick={() => navigate('/admin/login')}
                  style={{ backgroundColor: COLORS.primary }}
                  className="px-4 py-1.5 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {t.loginBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar user={loggedInUser} size="md" />
                  <div className="flex-1">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder={t.placeholder}
                      rows={2}
                      className="w-full p-2.5 border-2 border-slate-300 focus:border-primary outline-none text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pl-11">
                  <span className="text-[10px] font-bold text-slate-500">
                    {t.approvedNotice}
                  </span>
                  <div className="flex items-center gap-2">
                    {text.trim() && (
                      <button
                        type="button"
                        onClick={() => setText('')}
                        className="px-3.5 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-bold uppercase tracking-wider"
                      >
                        {t.cancel}
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={submitting || !text.trim()}
                      style={{ backgroundColor: COLORS.primary }}
                      className="px-4 py-1.5 text-white font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40"
                    >
                      {t.submit}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-slate-500">
              {t.loadingText}
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-200">
              {t.noComments}
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-slate-100">
              {comments.map((comment, index) => (
                <div
                  key={comment._id}
                  className={`pt-4 ${index === 0 ? 'pt-0' : ''}`}
                >
                  <div className="flex gap-3">
                    <Avatar user={comment.user} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800">
                          {comment.user?.name || 'User'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {!comment.isApproved && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 border border-amber-200">
                            Pending Approval
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>

                  {/* Replies Container (No avatar image included) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-11 pl-3 border-l-2 border-slate-200 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-800">
                                {reply.user?.name || 'User'}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
