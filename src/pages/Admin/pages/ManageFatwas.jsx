import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, Bookmark, CheckCircle } from 'lucide-react';
import { getFatwas, createFatwa, updateFatwa, deleteFatwa } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';
import { Input } from '../../../components/Input';

import { FATWA_CATEGORIES, FATWA_TRANSLATIONS } from '@/utils/categories';

export default function ManageFatwas() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [fatwas, setFatwas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

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

  const categories = FATWA_CATEGORIES;

  const loadFatwas = async () => {
    try {
      setLoading(true);
      const data = await getFatwas({ limit: 100 });
      setFatwas(data.fatwas || []);
    } catch (err) {
      console.error('Failed to load fatwas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFatwas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (htmlContent) => {
    setFormFields((prev) => ({ ...prev, detailedAnswer: htmlContent }));
  };

  const openCreateForm = () => {
    setActionError(null);
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
    setActionError(null);
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
    setActionError(null);
    setActionLoading(true);

    const payload = {
      ...formFields,
      references: formFields.references.split('\n').map((r) => r.trim()).filter((r) => r),
    };

    try {
      if (editingId) {
        await updateFatwa(editingId, payload);
        showSuccess(language === 'en' ? 'Fatwa updated successfully.' : 'فتویٰ کامیابی کے ساتھ اپ ڈیٹ ہو گیا۔');
      } else {
        await createFatwa(payload);
        showSuccess(language === 'en' ? 'Fatwa published successfully.' : 'فتویٰ کامیابی کے ساتھ شائع ہو گیا۔');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save fatwa');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this fatwa?' : 'کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟')) {
      setActionError(null);
      try {
        await deleteFatwa(id);
        showSuccess(language === 'en' ? 'Fatwa deleted successfully.' : 'فتویٰ کامیابی کے ساتھ حذف کر دیا گیا۔');
      } catch (err) {
        setActionError(err.response?.data?.message || err.message || 'Failed to delete fatwa');
      }
    }
  };

  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    loadFatwas();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className={`bg-background py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Module Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0">
              <ArrowRight className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">{language === 'en' ? 'Manage Fatwas' : 'فتاویٰ کا انتظام'}</h1>
              <p className="text-xs text-slate-400 font-light">{language === 'en' ? 'Add, edit, or delete Islamic fatwas.' : 'عالم صاحب کے شرعی احکام اور فتاویٰ شامل کریں، تدوین کریں یا حذف کریں۔'}</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif"
            >
              <Plus className="w-4 h-4 text-accent" />
              {language === 'en' ? 'Add Fatwa' : 'فتویٰ شامل کریں'}
            </button>
          )}
        </div>

        {/* Action success alert banner */}
        {success && (
          <div className={`bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form vs List Routing */}
        {isFormOpen ? (
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-primary islamic-pattern text-white px-6 py-4 border-b border-accent/35 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-md font-serif">
                {editingId
                  ? (language === 'en' ? 'Edit Fatwa' : 'فتویٰ کی تدوین کریں')
                  : (language === 'en' ? 'Add New Fatwa' : 'نیا شرعی فتویٰ شامل کریں')
                }
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-secondary hover:text-white underline font-light"
              >
                {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">

              {/* Form action errors */}
              {actionError && (
                <div className={`bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Fatwa Title / Issue *' : 'فتویٰ کا عنوان / شرعی مسئلہ *'}</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Islamic Rulings on Commercial Insurance Contracts' : 'مثال: تجارتی انشورنس معاہدوں کے شرعی احکام'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Category *' : 'زمرہ *'}</label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2.5 text-sm bg-slate-50 border border-border rounded outline-none text-slate-700 focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {language === 'en' ? cat : (FATWA_TRANSLATIONS[cat] || cat)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* The Question Details */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Question *' : 'سائل کا سوال *'}</label>
                <textarea
                  name="question"
                  value={formFields.question}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Enter detailed question here...' : 'پوچھا گیا تفصیلی سوال درج کریں...'}
                  rows={4}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Detailed Answer Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Detailed Answer (Rich Editor) *' : 'عالم صاحب کا تفصیلی جواب (رچ ایڈیٹر) *'}</label>
                <RichTextEditor
                  value={formFields.detailedAnswer}
                  onChange={handleEditorChange}
                  placeholder={language === 'en' ? 'Write official Islamic answer and verdict here...' : 'اپنا باضابطہ شرعی جواب اور فیصلہ یہاں تحریر کریں...'}
                />
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'References / Sources (one per line)' : 'حوالہ جات / کتب کے مراجع (ہر لائن میں ایک)'}</label>
                <textarea
                  name="references"
                  value={formFields.references}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g. Fath al-Bari by Ibn Hajar\nAl-Fatawa al-Hindiyyah' : 'مثال: فتح الباری از ابن حجر\nالفتاویٰ الہندیہ'}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
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
                    : (language === 'en' ? 'Save Fatwa' : 'فتویٰ محفوظ کریں')
                  }
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Fatwas List Table */
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : fatwas && fatwas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-border">
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{language === 'en' ? 'Title' : 'عنوان'}</th>
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{language === 'en' ? 'Category' : 'زمرہ'}</th>
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{language === 'en' ? 'Publish Date' : 'اشاعت کی تاریخ'}</th>
                      <th className="px-6 py-4 text-center">{language === 'en' ? 'Views' : 'مشاہدات'}</th>
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-left' : 'text-right'}`}>{language === 'en' ? 'Actions' : 'اقدامات'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {fatwas.map((fatwa) => (
                      <tr key={fatwa._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className={`px-6 py-4 font-bold font-serif max-w-xs truncate ${language === 'ur' ? 'text-right' : 'text-left'}`}>{fatwa.title}</td>
                        <td className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                            {language === 'en' ? fatwa.category : (FATWA_TRANSLATIONS[fatwa.category] || fatwa.category)}
                          </span>
                        </td>
                        <td className={`px-6 py-4 font-light text-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                          {new Date(fatwa.publishDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-xs text-accent">
                          {fatwa.viewCount || 0}
                        </td>
                        <td className={`px-6 py-4 ${language === 'ur' ? 'text-left' : 'text-right'}`}>
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(fatwa)}
                              className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors"
                              title={language === 'en' ? 'Edit Fatwa' : 'فتویٰ کی تدوین کریں'}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(fatwa._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title={language === 'en' ? 'Delete Fatwa' : 'فتویٰ حذف کریں'}
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
                <Bookmark className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 font-serif">{language === 'en' ? 'No fatwas uploaded yet' : 'کوئی فتویٰ اپ لوڈ نہیں کیا گیا'}</h3>
                <p className="text-slate-400 text-xs mt-1">{language === 'en' ? 'Click "Add Fatwa" button to publish your first fatwa.' : 'اپنا پہلا شرعی فتویٰ شائع کرنے کے لیے "فتویٰ شامل کریں" بٹن پر کلک کریں۔'}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
