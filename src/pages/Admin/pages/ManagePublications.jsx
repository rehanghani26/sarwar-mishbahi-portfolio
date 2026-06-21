import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, Book, CheckCircle } from 'lucide-react';
import { fetchPublications, createPublication, updatePublication, deletePublication, clearContentErrors } from '../../../store/slices/contentSlice';
import { Input } from '../../../components/Input';

const categoryTranslations = {
  'Quran Studies': 'علوم قرآن',
  'Hadith': 'حدیث',
  'Fiqh': 'فقہ',
  'Aqeedah': 'عقیدہ',
  'Seerah': 'سیرت',
  'Islamic History': 'اسلامی تاریخ',
  'Fatwa Collections': 'مجموعہ فتاویٰ',
  'Research Papers': 'تحقیقی مقالات',
};

const languageTranslations = {
  'English': 'انگریزی',
  'Urdu': 'اردو',
  'Arabic': 'عربی',
  'Persian': 'فارسی',
};

export default function ManagePublications() {
  const dispatch = useDispatch();

  const { list: publications, loading } = useSelector((state) => state.content.publications);
  const { actionLoading, actionError } = useSelector((state) => state.content);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields State
  const [formFields, setFormFields] = useState({
    title: '',
    description: '',
    category: 'Fiqh',
    language: 'English',
    author: 'Dr. Islamic Scholar',
    googleDriveLink: '',
  });

  const categories = [
    { value: 'Quran Studies', label: 'علوم قرآن' },
    { value: 'Hadith', label: 'حدیث' },
    { value: 'Fiqh', label: 'فقہ' },
    { value: 'Aqeedah', label: 'عقیدہ' },
    { value: 'Seerah', label: 'سیرت' },
    { value: 'Islamic History', label: 'اسلامی تاریخ' },
    { value: 'Fatwa Collections', label: 'مجموعہ فتاویٰ' },
    { value: 'Research Papers', label: 'تحقیقی مقالات' },
  ];

  useEffect(() => {
    dispatch(fetchPublications());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateForm = () => {
    dispatch(clearContentErrors());
    setEditingId(null);
    setFormFields({
      title: '',
      description: '',
      category: 'Fiqh',
      language: 'English',
      author: 'Dr. Islamic Scholar',
      googleDriveLink: '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (pub) => {
    dispatch(clearContentErrors());
    setEditingId(pub._id);
    setFormFields({
      title: pub.title,
      description: pub.description,
      category: pub.category,
      language: pub.language,
      author: pub.author,
      googleDriveLink: pub.googleDriveLink,
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearContentErrors());

    let result;
    if (editingId) {
      result = await dispatch(updatePublication({ id: editingId, pubData: formFields }));
      if (updatePublication.fulfilled.match(result)) {
        showSuccess('مطبوعہ کامیابی سے اپ ڈیٹ ہو گئی۔');
      }
    } else {
      result = await dispatch(createPublication(formFields));
      if (createPublication.fulfilled.match(result)) {
        showSuccess('مطبوعہ کامیابی سے شامل ہو گئی۔');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('کیا آپ واقعی اس مطبوعہ کو حذف کرنا چاہتے ہیں؟')) {
      dispatch(clearContentErrors());
      const result = await dispatch(deletePublication(id));
      if (deletePublication.fulfilled.match(result)) {
        showSuccess('مطبوعہ کامیابی سے حذف کر دی گئی۔');
      }
    }
  };

  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    dispatch(fetchPublications());
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-[#FAF9F5] py-10 min-h-[80vh]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3CF]/50 pb-5 text-right">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-[#EAE3CF] bg-white rounded text-slate-500 hover:text-[#8A6F52] shrink-0">
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#2F241C] font-serif">مطبوعات کا انتظام</h1>
              <p className="text-xs text-slate-400 font-light">کتابیں اور تحقیقی مقالات شامل کریں، اپ ڈیٹ کریں یا حذف کریں</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2F241C] hover:bg-[#1E1915] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif"
            >
              <Plus className="w-4 h-4 text-[#8A6F52]" />
              مطبوعہ شامل کریں
            </button>
          )}
        </div>

        {/* Success alert */}
        {success && (
          <div className="bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form vs List Routing */}
        {isFormOpen ? (
          <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm overflow-hidden text-right">
            <div className="bg-[#2F241C] islamic-pattern text-white px-6 py-4 border-b border-[#8A6F52]/35 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-md font-serif">
                {editingId ? 'مطبوعہ کی تفصیلات میں ترمیم کریں' : 'گوگل ڈرائیو کی نئی مطبوعہ شامل کریں'}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#EAE3CF] hover:text-white underline font-light"
              >
                منسوخ کریں
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Alert error */}
              {actionError && (
                <div className="bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">مطبوعہ کا عنوان *</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: اصول فقہ کی رہنمائی"
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all text-right"
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">مصنف کا نام *</label>
                  <Input
                    type="text"
                    name="author"
                    value={formFields.author}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: مفتی صاحب / ڈاکٹر صاحب"
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all text-right"
                    border=""
                  />
                </div>
              </div>

              {/* Category & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">زمرہ *</label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none text-slate-700 focus:border-[#8A6F52]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">زبان *</label>
                  <Input
                    type="text"
                    name="language"
                    value={formFields.language}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: Urdu / Arabic / English"
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all text-right"
                    border=""
                  />
                </div>
              </div>

              {/* Drive Link */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">گوگل ڈرائیو شیئر لنک *</label>
                <Input
                  type="url"
                  name="googleDriveLink"
                  value={formFields.googleDriveLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all text-right"
                  border=""
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">مختصر تفصیل *</label>
                <textarea
                  name="description"
                  value={formFields.description}
                  onChange={handleInputChange}
                  required
                  placeholder="اس مطبوعہ فائل کا مختصر جائزہ فراہم کریں..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all resize-y text-right"
                ></textarea>
              </div>

              {/* Action operations */}
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
                  {actionLoading ? 'محفوظ ہو رہا ہے...' : 'مطبوعہ محفوظ کریں'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Publications List Table */
          <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm overflow-hidden text-right">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
              </div>
            ) : publications && publications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-[#EAE3CF]">
                      <th className="px-6 py-4 text-right">عنوان</th>
                      <th className="px-6 py-4 text-right">مصنف</th>
                      <th className="px-6 py-4 text-right">زمرہ</th>
                      <th className="px-6 py-4 text-right">زبان</th>
                      <th className="px-6 py-4 text-left">اقدامات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {publications.map((pub) => (
                      <tr key={pub._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold font-serif max-w-xs truncate">{pub.title}</td>
                        <td className="px-6 py-4 font-light text-xs">{pub.author}</td>
                        <td className="px-6 py-4">
                          <span className="bg-[#2F241C]/10 text-[#2F241C] text-[10px] font-bold px-2 py-0.5 rounded">
                            {categoryTranslations[pub.category] || pub.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                          {languageTranslations[pub.language] || pub.language}
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(pub)}
                              className="p-1.5 text-[#8A6F52] hover:bg-amber-50 rounded transition-colors"
                              title="ترمیم کریں"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(pub._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="حذف کریں"
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
              <div className="text-center py-20">
                <Book className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 font-serif">کوئی مطبوعہ درج نہیں ہے</h3>
                <p className="text-slate-400 text-xs mt-1">اپنی پہلی مطبوعہ تخلیق کرنے کے لیے "مطبوعہ شامل کریں" بٹن پر کلک کریں۔</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

