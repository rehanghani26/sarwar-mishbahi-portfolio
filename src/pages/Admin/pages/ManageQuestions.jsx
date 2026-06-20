import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, ShieldQuestion, HelpCircle, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { fetchAdminQuestions, answerQuestion, deleteQuestion, clearContentErrors } from '../../../store/slices/contentSlice';
import useTranslate from '../../../hooks/useTranslate';
import { Input } from '../../../components/Input';

export default function ManageQuestions() {
  const dispatch = useDispatch();
  const { t, isUrdu } = useTranslate();

  const { list: questions, loading } = useSelector((state) => state.content.questions);
  const { actionLoading, actionError } = useSelector((state) => state.content);

  const [activeQuestion, setActiveQuestion] = useState(null); // Currently selected question for answering
  const [answerContent, setAnswerContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminQuestions());
  }, [dispatch]);

  const selectQuestion = (q) => {
    dispatch(clearContentErrors());
    setActiveQuestion(q);
    setAnswerContent(q.answerContent || '');
    setIsPublic(q.isPublic || false);
    setSuccess(false);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearContentErrors());
    if (!activeQuestion) return;

    const result = await dispatch(
      answerQuestion({
        id: activeQuestion._id,
        answerData: { answerContent, isPublic },
      })
    );

    if (answerQuestion.fulfilled.match(result)) {
      setSuccess(true);
      setActiveQuestion(null);
      dispatch(fetchAdminQuestions());
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(clearContentErrors());
      const result = await dispatch(deleteQuestion(id));
      if (deleteQuestion.fulfilled.match(result)) {
        if (activeQuestion?._id === id) setActiveQuestion(null);
        setSuccess(true);
        dispatch(fetchAdminQuestions());
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  const pendingCount = questions ? questions.filter((q) => q.status === 'pending').length : 0;

  return (
    <div className="bg-[#FAF9F5] py-10 min-h-[80vh]" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inbox List (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`flex items-center gap-3 border-b border-[#EAE3CF]/50 pb-5 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <Link to="/admin/dashboard" className="p-2 border border-[#EAE3CF] bg-white rounded text-slate-500 hover:text-[#8A6F52] shrink-0">
              <ArrowLeft className={`w-4.5 h-4.5 ${isUrdu ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#2F241C] font-serif">{t('Manage Questions')}</h1>
              <p className="text-xs text-slate-400 font-light">{pendingCount} {t('Pending Inbox') || 'pending items in inbox'}</p>
            </div>
          </div>
 
          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3.5 flex items-start gap-2 text-emerald-800 text-xs shadow-xs shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{t('Inbox updated successfully.') || 'Inbox updated successfully.'}</span>
            </div>
          )}

          {/* Table list */}
          <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm overflow-hidden">
            <div className={`bg-slate-50 border-b border-[#EAE3CF] px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-500 uppercase ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <span>{t('Question Title')}</span>
              <span>{t('Status')}</span>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2F241C]"></div>
              </div>
            ) : questions && questions.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {questions.map((q) => {
                  const isSelected = activeQuestion?._id === q._id;
                  const isPending = q.status === 'pending';
                  return (
                    <div
                      key={q._id}
                      onClick={() => selectQuestion(q)}
                      className={`p-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors ${
                        isSelected ? `bg-slate-100/80 ${isUrdu ? 'border-l-4 border-[#8A6F52]' : 'border-r-4 border-[#8A6F52]'}` : ''
                      } ${isUrdu ? 'text-right' : 'text-left'}`}
                    >
                      <div className={`flex items-center justify-between gap-3 mb-1.5 text-[10px] text-slate-400 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold text-slate-500">{q.category}</span>
                        <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1 font-serif">{q.questionTitle}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-light">{isUrdu ? `منجانب: ${q.fullName}` : `By ${q.fullName}`}</p>
                      
                      <div className={`flex items-center justify-between mt-3.5 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t(isPending ? 'Pending' : 'Answered') || q.status}
                        </span>
                        
                        {!isPending && (
                          <span className="text-slate-400 flex items-center gap-0.5 text-[9px] font-semibold">
                            {q.isPublic ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                            {q.isPublic ? t('Public') || 'Public' : t('Private') || 'Private'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 italic text-xs">
                <ShieldQuestion className="w-10 h-10 text-[#8A6F52] mx-auto mb-3" />
                {t('No questions submitted yet.') || 'No questions submitted yet.'}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Answer Form (7 columns) */}
        <div className="lg:col-span-7">
          {activeQuestion ? (
            <div className={`bg-white border border-[#EAE3CF] rounded-lg shadow-sm p-6 space-y-5 ${isUrdu ? 'text-right' : 'text-left'}`}>
              
              {/* Heading */}
              <div className={`border-b border-slate-100 pb-3 flex items-center justify-between ${isUrdu ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-md font-bold text-[#2F241C] font-serif uppercase tracking-wide">
                  {t('Answer Question')}
                </h2>
                <button
                  type="button"
                  onClick={() => handleDelete(activeQuestion._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title={t('Delete Question')}
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Error messages */}
              {actionError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Sender Details */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded border border-slate-100 ${isUrdu ? 'text-right font-serif' : 'text-left font-sans'}`}>
                <div>
                  <span className="block font-bold text-slate-400 uppercase">{isUrdu ? 'منجانب:' : 'From:'}</span>
                  <span className="text-slate-700 font-semibold">{activeQuestion.fullName}</span>
                  <span className="block text-slate-400 mt-0.5">({activeQuestion.email})</span>
                  {activeQuestion.phoneNumber && <span className="block text-slate-400">{isUrdu ? 'فون:' : 'Phone:'} {activeQuestion.phoneNumber}</span>}
                </div>
                <div>
                  <span className="block font-bold text-slate-400 uppercase">{isUrdu ? 'زمرہ اور تاریخ:' : 'Category & Date:'}</span>
                  <span className="text-slate-700 font-semibold">{activeQuestion.category}</span>
                  <span className="block text-slate-400 mt-0.5">{isUrdu ? 'جمع کرایا گیا:' : 'Submitted:'} {new Date(activeQuestion.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Title & Question details */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-serif mb-2">
                  {isUrdu ? 'سوال:' : 'Question:'} {activeQuestion.questionTitle}
                </h3>
                <div className={`bg-[#FAF9F5] p-4 rounded text-xs leading-relaxed text-slate-600 italic ${isUrdu ? 'border-r-2 border-[#8A6F52]' : 'border-l-2 border-[#8A6F52]'}`}>
                  "{activeQuestion.detailedQuestion}"
                </div>
              </div>

              {/* Answer Form */}
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Scholar Response Answer *') || 'Scholar Response Answer *'}</label>
                  <textarea
                    required
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder={t('Type Shariah ruling response answer details here...') || 'Type Shariah ruling response answer details here...'}
                    rows={6}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all resize-y font-sans"
                  ></textarea>
                </div>

                {/* Make Public check box */}
                <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <Input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    inputClassName="w-4 h-4 text-[#8A6F52] border-[#EAE3CF] rounded focus:ring-[#8A6F52]"
                    border=""
                  />
                  <label htmlFor="isPublic" className="text-xs font-bold text-slate-600 cursor-pointer">
                    {t('Approve and Make Public on Q&A Page') || 'Approve and Make Public on Q&A Page'}
                  </label>
                </div>

                {/* Actions */}
                <div className={`flex ${isUrdu ? 'justify-start' : 'justify-end'} gap-3 pt-3 border-t border-slate-50`}>
                  <button
                    type="button"
                    onClick={() => setActiveQuestion(null)}
                    className="px-4 py-2 border border-[#EAE3CF] text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#2F241C] hover:bg-[#1E1915] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-[#8A6F52]" />
                    {actionLoading ? t('Saving...') : t('Save Answer') || 'Save Answer'}
                  </button>
                </div>

              </form>

            </div>
          ) : (
            <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
              <HelpCircle className="w-12 h-12 text-[#8A6F52] mb-4" />
              <h3 className="text-lg font-bold text-slate-700 font-serif">{t('No Question Selected') || 'No Question Selected'}</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                {t('Select a submitted question from the inbox list on the left to review, answer, or delete it.') || 'Select a submitted question from the inbox list on the left to review, answer, or delete it.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
