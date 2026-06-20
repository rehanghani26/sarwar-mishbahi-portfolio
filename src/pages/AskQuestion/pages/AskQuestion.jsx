import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HelpCircle, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { submitQuestion, clearContentErrors } from '../../../store/slices/contentSlice';
import { Input } from '../../../components/Input';

export default function AskQuestion() {
  const dispatch = useDispatch();
  const { actionLoading, actionError } = useSelector((state) => state.content);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    category: 'General Questions',
    questionTitle: '',
    detailedQuestion: '',
  });

  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = [
    'Salah',
    'Fasting',
    'Zakat',
    'Hajj & Umrah',
    'Marriage',
    'Divorce',
    'Business',
    'Family Issues',
    'Education',
    'General Questions',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearContentErrors());

    if (!formData.fullName || !formData.email || !formData.questionTitle || !formData.detailedQuestion) {
      return;
    }

    const result = await dispatch(submitQuestion(formData));
    if (submitQuestion.fulfilled.match(result)) {
      setSuccess(true);
      setSuccessMsg(result.payload.message || 'Your question has been submitted successfully.');
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        category: 'General Questions',
        questionTitle: '',
        detailedQuestion: '',
      });
    }
  };

  return (
    <div className="bg-[#FAF9F5] dark:bg-slate-900 py-12 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6">

        {/* Success Banner */}
        {success ? (
          <div className="premium-card p-8 shadow-sm text-center">
            <CheckCircle className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#2F241C] dark:text-emerald-400 font-serif mb-3">Submission Received</h2>
            <p className="text-slate-700 dark:text-slate-350 text-sm leading-relaxed mb-6 font-light">{successMsg}</p>
            <button
              onClick={() => setSuccess(false)}
              className="px-5 py-2.5 bg-[#2F241C] text-white text-xs font-bold rounded uppercase tracking-wider font-serif hover:bg-[#1E1915] transition-colors"
            >
              Ask Another Question
            </button>
          </div>
        ) : (
          <div className="premium-card shadow-sm overflow-hidden">

            {/* Header Title */}
            <div className="bg-[#2F241C] islamic-pattern text-white p-6 relative border-b border-[#8A6F52]/35 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-[#8A6F52] shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-white font-serif">Ask a Question</h1>
                <p className="text-[10px] text-[#EAE3CF] mt-0.5">Submit your query directly to the scholar</p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">

              {/* Alert Message */}
              {actionError && (
                <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 flex items-start gap-2 text-red-700 dark:text-red-400 text-xs shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Full Name *</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
                  border=""
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Email Address *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@example.com"
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Phone Number (Optional)</label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
                    border=""
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Select Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:border-[#8A6F52] dark:focus:border-emerald-500 rounded outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Title */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Question Title *</label>
                <Input
                  type="text"
                  name="questionTitle"
                  value={formData.questionTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Calculation of Zakat on Retirement Funds"
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
                  border=""
                />
              </div>

              {/* Question Detail */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Detailed Question *</label>
                <textarea
                  name="detailedQuestion"
                  value={formData.detailedQuestion}
                  onChange={handleInputChange}
                  required
                  placeholder="Provide all relevant details to help the scholar understand your query..."
                  rows={6}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all resize-y placeholder:text-slate-400"
                ></textarea>
              </div>

              {/* Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#8A6F52] hover:bg-[#725B43] text-white font-bold rounded shadow-sm hover:shadow transition-all uppercase tracking-wider font-serif text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {actionLoading ? 'Submitting Question...' : 'Submit to Scholar'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
