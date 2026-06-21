import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, Bookmark, CheckCircle } from 'lucide-react';
import { fetchFatwas, createFatwa, updateFatwa, deleteFatwa, clearContentErrors } from '../../../store/slices/contentSlice';
import RichTextEditor from '../../../components/RichTextEditor';
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

export default function ManageFatwas() {
  const dispatch = useDispatch();

  const { list: fatwas, loading } = useSelector((state) => state.content.fatwas);
  const { actionLoading, actionError } = useSelector((state) => state.content);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields State
  const [formFields, setFormFields] = useState({
    title: '',
    category: 'Salah',
    question: '',
    detailedAnswer: '',
    references: '',
  });

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

  useEffect(() => {
    dispatch(fetchFatwas({ limit: 100 })); // Load larger set for management
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (htmlContent) => {
    setFormFields((prev) => ({ ...prev, detailedAnswer: htmlContent }));
  };

  const openCreateForm = () => {
    dispatch(clearContentErrors());
    setEditingId(null);
    setFormFields({
      title: '',
      category: 'Salah',
      question: '',
      detailedAnswer: '',
      references: '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (fatwa) => {
    dispatch(clearContentErrors());
    setEditingId(fatwa._id);
    setFormFields({
      title: fatwa.title,
      category: fatwa.category,
      question: fatwa.question,
      detailedAnswer: fatwa.detailedAnswer,
      references: fatwa.references ? fatwa.references.join('\n') : '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearContentErrors());

    const payload = {
      ...formFields,
      references: formFields.references.split('\n').map((r) => r.trim()).filter((r) => r),
    };

    let result;
    if (editingId) {
      result = await dispatch(updateFatwa({ id: editingId, fatwaData: payload }));
      if (updateFatwa.fulfilled.match(result)) {
        showSuccess('فتویٰ کامیابی کے ساتھ اپ ڈیٹ ہو گیا۔');
      }
    } else {
      result = await dispatch(createFatwa(payload));
      if (createFatwa.fulfilled.match(result)) {
        showSuccess('فتویٰ کامیابی کے ساتھ شائع ہو گیا۔');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟')) {
      dispatch(clearContentErrors());
      const result = await dispatch(deleteFatwa(id));
      if (deleteFatwa.fulfilled.match(result)) {
        showSuccess('فتویٰ کامیابی کے ساتھ حذف کر دیا گیا۔');
      }
    }
  };

  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    dispatch(fetchFatwas({ limit: 100 }));
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-[#FAF9F5] py-10 min-h-[80vh] text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3CF]/50 pb-5 text-right">
          <div className="flex items-center gap-3 text-right">
            <Link to="/admin/dashboard" className="p-2 border border-[#EAE3CF] bg-white rounded text-slate-500 hover:text-[#8A6F52] shrink-0">
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-[#2F241C] font-serif text-right">فتاویٰ کا انتظام</h1>
              <p className="text-xs text-slate-400 font-light text-right">عالم صاحب کے شرعی احکام اور فتاویٰ شامل کریں، تدوین کریں یا حذف کریں۔</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2F241C] hover:bg-[#1E1915] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif"
            >
              <Plus className="w-4 h-4 text-[#8A6F52]" />
              فتویٰ شامل کریں
            </button>
          )}
        </div>

        {/* Action success alert banner */}
        {success && (
          <div className="bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs text-right">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form vs List Routing */}
        {isFormOpen ? (
          <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm overflow-hidden text-right">
            <div className="bg-[#2F241C] islamic-pattern text-white px-6 py-4 border-b border-[#8A6F52]/35 flex items-center justify-between text-right">
              <h2 className="font-bold text-sm sm:text-md font-serif text-right">
                {editingId ? 'فتویٰ کی تدوین کریں' : 'نیا شرعی فتویٰ شامل کریں'}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#EAE3CF] hover:text-white underline font-light"
              >
                منسوخ کریں
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-right">
              
              {/* Form action errors */}
              {actionError && (
                <div className="bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0 text-right">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
                <div className="sm:col-span-2 text-right">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 text-right">فتویٰ کا عنوان / شرعی مسئلہ *</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: تجارتی انشورنس معاہدوں کے شرعی احکام"
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all text-right"
                    border=""
                  />
                </div>
                <div className="text-right">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 text-right">زمرہ *</label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none text-slate-700 focus:border-[#8A6F52] text-right"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryTranslations[cat] || cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* The Question Details */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 text-right">سائل کا سوال *</label>
                <textarea
                  name="question"
                  value={formFields.question}
                  onChange={handleInputChange}
                  required
                  placeholder="پوچھا گیا تفصیلی سوال درج کریں..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all resize-y text-right"
                ></textarea>
              </div>

              {/* Detailed Answer Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 text-right">عالم صاحب کا تفصیلی جواب (رچ ایڈیٹر) *</label>
                <RichTextEditor
                  value={formFields.detailedAnswer}
                  onChange={handleEditorChange}
                  placeholder="اپنا باضابطہ شرعی جواب اور فیصلہ یہاں تحریر کریں..."
                />
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 text-right">حوالہ جات / کتب کے مراجع (ہر لائن میں ایک)</label>
                <textarea
                  name="references"
                  value={formFields.references}
                  onChange={handleInputChange}
                  placeholder="مثال: فتح الباری از ابن حجر&#10;الفتاویٰ الہندیہ"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all resize-y text-right"
                ></textarea>
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-[#EAE3CF] text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#2F241C] hover:bg-[#1E1915] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-[#8A6F52]" />
                  {actionLoading ? 'محفوظ کیا جا رہا ہے...' : 'فتویٰ محفوظ کریں'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Fatwas List Table */
          <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm overflow-hidden text-right">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
              </div>
            ) : fatwas && fatwas.length > 0 ? (
              <div className="overflow-x-auto text-right">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-[#EAE3CF] text-right">
                      <th className="px-6 py-4 text-right">عنوان</th>
                      <th className="px-6 py-4 text-right">زمرہ</th>
                      <th className="px-6 py-4 text-right">اشاعت کی تاریخ</th>
                      <th className="px-6 py-4 text-center">مشاہدات</th>
                      <th className="px-6 py-4 text-left">اقدامات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700 text-right">
                    {fatwas.map((fatwa) => (
                      <tr key={fatwa._id} className="hover:bg-slate-50/50 transition-colors text-right">
                        <td className="px-6 py-4 font-bold font-serif max-w-xs truncate text-right">{fatwa.title}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-[#2F241C]/10 text-[#2F241C] text-[10px] font-bold px-2 py-0.5 rounded">
                            {categoryTranslations[fatwa.category] || fatwa.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-light text-xs text-right">
                          {new Date(fatwa.publishDate).toLocaleDateString('ur-PK')}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-xs text-[#8A6F52]">
                          {fatwa.viewCount || 0}
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="inline-flex items-center gap-2">
                             <button
                               onClick={() => openEditForm(fatwa)}
                               className="p-1.5 text-[#8A6F52] hover:bg-amber-50 rounded transition-colors"
                               title="فتویٰ کی تدوین کریں"
                             >
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button
                               onClick={() => handleDelete(fatwa._id)}
                               className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                               title="فتویٰ حذف کریں"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 text-center">
                <Bookmark className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 font-serif">کوئی فتویٰ اپ لوڈ نہیں کیا گیا</h3>
                <p className="text-slate-400 text-xs mt-1">اپنا پہلا شرعی فتویٰ شائع کرنے کے لیے "فتویٰ شامل کریں" بٹن پر کلک کریں۔</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
