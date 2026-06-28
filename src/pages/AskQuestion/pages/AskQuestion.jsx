import React, { useState } from 'react';
import { HelpCircle, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { submitQuestion } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '../../../components/Input';

import { QA_CATEGORIES, QA_TRANSLATIONS } from '@/utils/categories';

export default function AskQuestion() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    category: 'General Questions',
    questionTitle: '',
    detailedQuestion: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = QA_CATEGORIES;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    if (!formData.fullName || !formData.email || !formData.questionTitle || !formData.detailedQuestion) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await submitQuestion(formData);
      setSuccess(true);
      setSuccessMsg(result.message || (language === 'en' ? 'Your question has been submitted successfully.' : 'آپ کا سوال کامیابی کے ساتھ جمع کرا دیا گیا ہے۔'));
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        category: 'General Questions',
        questionTitle: '',
        detailedQuestion: '',
      });
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to submit question');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={`bg-background dark:bg-slate-900 py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-xl mx-auto px-4 sm:px-6">

        {/* Success Banner */}
        {success ? (
          <div className="premium-card p-8 shadow-sm text-center">
            <CheckCircle className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary dark:text-emerald-400 font-serif mb-3">
              {language === 'en' ? 'Question Received' : 'سوال موصول ہو گیا'}
            </h2>
            <p className="text-slate-700 dark:text-slate-350 text-sm leading-relaxed mb-6 font-light">{successMsg}</p>
            <button
              onClick={() => setSuccess(false)}
              className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded uppercase tracking-wider font-serif hover:bg-primary/90 transition-colors"
            >
              {language === 'en' ? 'Ask Another Question' : 'ایک اور سوال پوچھیں'}
            </button>
          </div>
        ) : (
          <div className="premium-card shadow-sm overflow-hidden text-start">

            {/* Header Title */}
            <div className={`bg-primary islamic-pattern text-white p-6 relative border-b border-accent/35 flex items-center gap-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
              <HelpCircle className="w-8 h-8 text-accent shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-white font-serif">
                  {language === 'en' ? 'Ask Question' : 'سوال پوچھیں'}
                </h1>
                <p className="text-[10px] text-secondary mt-0.5">
                  {language === 'en' ? 'Send your question directly to the scholar/mufti' : 'اپنا سوال براہِ راست عالم/مفتی صاحب کو ارسال کریں'}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">

              {/* Alert Message */}
              {actionError && (
                <div className="bg-red-50 dark:bg-red-950/20 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 dark:text-red-400 text-xs shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  {language === 'en' ? 'Full Name *' : 'مکمل نام *'}
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Enter your name' : 'اپنا نام لکھیں'}
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  border=""
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    {language === 'en' ? 'Email Address *' : 'ای میل ایڈریس *'}
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@example.com"
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    {language === 'en' ? 'Phone Number (Optional)' : 'فون نمبر (اختیاری)'}
                  </label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  {language === 'en' ? 'Select Category *' : 'زمرہ منتخب کریں *'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:border-accent dark:focus:border-emerald-500 rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {language === 'ur' ? (QA_TRANSLATIONS[cat] || cat) : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Title */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  {language === 'en' ? 'Question Title *' : 'سوال کا عنوان *'}
                </label>
                <Input
                  type="text"
                  name="questionTitle"
                  value={formData.questionTitle}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'e.g. Zakat calculation on retirement funds' : 'مثال: ریٹائرمنٹ فنڈز پر زکوٰۃ کا حساب'}
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  border=""
                />
              </div>

              {/* Question Detail */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  {language === 'en' ? 'Detailed Question *' : 'تفصیلی سوال *'}
                </label>
                <textarea
                  name="detailedQuestion"
                  value={formData.detailedQuestion}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Provide all relevant details to explain your query to the scholar...' : 'عالم صاحب کو اپنا مسئلہ سمجھانے کے لیے تمام متعلقہ تفصیلات فراہم کریں...'}
                  rows={6}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all resize-y placeholder:text-slate-400 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded shadow-sm hover:shadow transition-all uppercase tracking-wider font-serif text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {actionLoading 
                    ? (language === 'en' ? 'Submitting question...' : 'سوال جمع کیا جا رہا ہے...') 
                    : (language === 'en' ? 'Send to Scholar' : 'عالم صاحب کو بھیجیں')
                  }
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
