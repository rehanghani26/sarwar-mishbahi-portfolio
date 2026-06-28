import { COLORS } from '@/utils/themeColors';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Save, Trash2, ShieldQuestion, HelpCircle, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { getAdminQuestions, answerQuestion, deleteQuestion } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '../../../components/Input';

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

export default function ManageQuestions() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const [activeQuestion, setActiveQuestion] = useState(null); // Currently selected question for answering
  const [answerContent, setAnswerContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getAdminQuestions();
      setQuestions(Array.isArray(data) ? data : (data.questions || []));
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const selectQuestion = (q) => {
    setActionError(null);
    setActiveQuestion(q);
    setAnswerContent(q.answerContent || '');
    setIsPublic(q.isPublic || false);
    setSuccess(false);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    if (!activeQuestion) return;

    setActionLoading(true);
    try {
      await answerQuestion(activeQuestion._id, { answerContent, isPublic });
      setSuccess(true);
      setActiveQuestion(null);
      loadQuestions();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save answer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this question?' : 'کیا آپ واقعی اس سوال کو حذف کرنا چاہتے ہیں؟')) {
      setActionError(null);
      try {
        await deleteQuestion(id);
        if (activeQuestion?._id === id) setActiveQuestion(null);
        setSuccess(true);
        loadQuestions();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setActionError(err.response?.data?.message || err.message || 'Failed to delete question');
      }
    }
  };

  const pendingCount = questions ? questions.filter((q) => q.status === 'pending').length : 0;

  return (
    <div className={`bg-background py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inbox List (5 columns) */}
        <div className={`lg:col-span-5 space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-3 border-b border-border/50 pb-5 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <Link to="/admin/dashboard" className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0">
              <ArrowRight className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-primary font-serif">{language === 'en' ? 'Manage Questions' : 'سوالات کا انتظام'}</h1>
              <p className="text-xs text-slate-400 font-light">{language === 'en' ? `${pendingCount} pending in inbox` : `${pendingCount} ان باکس میں زیرِ التوا`}</p>
            </div>
          </div>
  
          {/* Success Banner */}
          {success && (
            <div className={`bg-emerald-50 border-r-4 border-emerald-500 p-3.5 flex items-start gap-2 text-emerald-800 text-xs shadow-xs shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{language === 'en' ? 'Inbox updated successfully.' : 'ان باکس کامیابی کے ساتھ اپ ڈیٹ ہو گیا۔'}</span>
            </div>
          )}

          {/* Table list */}
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <div className={`bg-slate-50 border-b border-border px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-500 uppercase ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <span>{language === 'en' ? 'Question Title' : 'سوال کا عنوان'}</span>
              <span>{language === 'en' ? 'Status' : 'حیثیت'}</span>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
                      className={`p-4 cursor-pointer hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-slate-100/80 border-r-4 border-accent' : ''
                      }`}
                    >
                      <div className={`flex items-center justify-between gap-3 mb-1.5 text-[10px] text-slate-400 ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                        <span className="font-semibold text-slate-500">{language === 'en' ? q.category : (categoryTranslations[q.category] || q.category)}</span>
                        <span>{new Date(q.createdAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}</span>
                      </div>
                      <h4 className={`text-sm font-bold text-slate-800 line-clamp-1 font-serif ${language === 'ur' ? 'text-right' : 'text-left'}`}>{q.questionTitle}</h4>
                      <p className={`text-xs text-slate-400 line-clamp-1 mt-1 font-light ${language === 'ur' ? 'text-right' : 'text-left'}`}>{language === 'en' ? 'From: ' : 'منجانب: '}{q.fullName}</p>
                      
                      <div className={`flex items-center justify-between mt-3.5 ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isPending 
                            ? (language === 'en' ? 'Pending' : 'زیرِ التوا') 
                            : (language === 'en' ? 'Answered' : 'جواب شدہ')
                          }
                        </span>
                        
                        {!isPending && (
                          <span className="text-slate-400 flex items-center gap-0.5 text-[9px] font-semibold">
                            {q.isPublic ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                            {q.isPublic 
                              ? (language === 'en' ? 'Public' : 'پبلک') 
                              : (language === 'en' ? 'Private' : 'پرائیویٹ')
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 italic text-xs">
                <ShieldQuestion className="w-10 h-10 text-accent mx-auto mb-3" />
                {language === 'en' ? 'No questions submitted yet.' : 'ابھی تک کوئی سوال جمع نہیں کرایا گیا۔'}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Answer Form (7 columns) */}
        <div className={`lg:col-span-7 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          {activeQuestion ? (
            <div className="bg-white border border-border rounded-lg shadow-sm p-6 space-y-5">
              
              {/* Heading */}
              <div className={`border-b border-slate-100 pb-3 flex items-center justify-between ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                <h2 className="text-md font-bold text-primary font-serif uppercase tracking-wide">
                  {language === 'en' ? 'Answer Question' : 'سوال کا جواب دیں'}
                </h2>
                <button
                  type="button"
                  onClick={() => handleDelete(activeQuestion._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title={language === 'en' ? 'Delete Question' : 'سوال حذف کریں'}
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Error messages */}
              {actionError && (
                <div className={`bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Sender Details */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded border border-slate-100 font-serif ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                <div>
                  <span className="block font-bold text-slate-400 uppercase">{language === 'en' ? 'From:' : 'منجانب:'}</span>
                  <span className="text-slate-700 font-semibold">{activeQuestion.fullName}</span>
                  <span className="block text-slate-400 mt-0.5">({activeQuestion.email})</span>
                  {activeQuestion.phoneNumber && <span className="block text-slate-400">{language === 'en' ? 'Phone:' : 'فون:'} {activeQuestion.phoneNumber}</span>}
                </div>
                <div>
                  <span className="block font-bold text-slate-400 uppercase">{language === 'en' ? 'Category & Date:' : 'زمرہ اور تاریخ:'}</span>
                  <span className="text-slate-700 font-semibold">{language === 'en' ? activeQuestion.category : (categoryTranslations[activeQuestion.category] || activeQuestion.category)}</span>
                  <span className="block text-slate-400 mt-0.5">{language === 'en' ? 'Submitted:' : 'جمع کرایا گیا:'} {new Date(activeQuestion.createdAt).toLocaleString(language === 'ur' ? 'ur-PK' : 'en-US')}</span>
                </div>
              </div>

              {/* Title & Question details */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-serif mb-2">
                  {language === 'en' ? 'Question:' : 'سوال:'} {activeQuestion.questionTitle}
                </h3>
                <div className={`bg-background p-4 rounded text-xs leading-relaxed text-slate-600 italic border-slate-200 ${language === 'ur' ? 'border-r-2 border-accent text-right' : 'border-l-2 border-accent text-left'}`}>
                  "{activeQuestion.detailedQuestion}"
                </div>
              </div>

              {/* Answer Form */}
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Scholar Answer *' : 'عالم صاحب کا جواب *'}</label>
                  <textarea
                    required
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder={language === 'en' ? 'Write the Islamic ruling and details here...' : 'شرعی حکم اور جواب کی تفصیلات یہاں لکھیں...'}
                    rows={6}
                    className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  ></textarea>
                </div>

                {/* Make Public check box */}
                <div className={`flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                  <Input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    inputClassName="w-4 h-4 text-accent border-border rounded focus:ring-[COLORS.accent]"
                    border=""
                  />
                  <label htmlFor="isPublic" className="text-xs font-bold text-slate-600 cursor-pointer">
                    {language === 'en' ? 'Approve and publish publically to Q&A page' : 'منظور کریں اور سوال و جواب کے صفحے پر پبلک کریں'}
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-start gap-3 pt-3 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setActiveQuestion(null)}
                    className="px-4 py-2 border border-border text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif"
                  >
                    {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-accent" />
                    {actionLoading 
                      ? (language === 'en' ? 'Saving...' : 'محفوظ کیا جا رہا ہے...') 
                      : (language === 'en' ? 'Save Answer' : 'جواب محفوظ کریں')
                    }
                  </button>
                </div>

              </form>

            </div>
          ) : (
            <div className="bg-white border border-border rounded-lg shadow-sm p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
              <HelpCircle className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-lg font-bold text-slate-700 font-serif">{language === 'en' ? 'No Question Selected' : 'کوئی سوال منتخب نہیں کیا گیا'}</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                {language === 'en' 
                  ? 'Select a question from the inbox list on the left to review, answer, or delete it.'
                  : 'جائزہ لینے، جواب دینے یا حذف کرنے کے لیے بائیں جانب ان باکس کی فہرست سے کوئی جمع کرایا گیا سوال منتخب کریں۔'
                }
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
