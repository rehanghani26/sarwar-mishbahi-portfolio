import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, Book, CheckCircle, Eye } from 'lucide-react';
import { getPublications, createPublication, updatePublication, deletePublication } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, PdfViewer, Table } from '@/components';

import { CATEGORY_MAP, PUBLICATION_TRANSLATIONS, BOOK_LANGUAGE_TRANSLATIONS } from '@/utils/categories';

const BOOK_LANGUAGES = [
  { value: 'ur', labelUr: 'اردو', labelEn: 'Urdu' },
  { value: 'ar', labelUr: 'عربی', labelEn: 'Arabic' },
  { value: 'en', labelUr: 'انگریزی', labelEn: 'English' },
];

export default function ManagePublications() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [publications, setPublications] = useState([]);
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
    summary: '',
    category: 'تفسیرِ قرآن',
    blanguage: 'ur',
    author: 'مفتی فیضان سرور مصباحی',
    pageCount: '',
    tags: '',
    references: '',
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState('auto');
  const [previewTitle, setPreviewTitle] = useState('Preview');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categories = CATEGORY_MAP.publications;

  const loadPublications = async () => {
    try {
      setLoading(true);
      const data = await getPublications();
      setPublications(Array.isArray(data) ? data : (data.books || []));
    } catch (err) {
      console.error('Failed to load publications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateForm = () => {
    setActionError(null);
    setEditingId(null);
    setFormFields({
      title: '',
      summary: '',
      category: 'QURAN_TAFSEER',
      blanguage: 'ur',
      author: 'مفتی فیضان سرور مصباحی',
      pageCount: '',
      tags: '',
      references: '',
    });
    setCoverImageFile(null);
    setPdfFile(null);
    setExistingPdfUrl(null);
    setExistingCoverUrl(null);
    setPreviewUrl(null);
    setIsPreviewOpen(false);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (pub) => {
    setActionError(null);
    setEditingId(pub._id);
    
    const categoryMap = {
      'تفسیرِ قرآن': 'QURAN_TAFSEER',
      'علومِ حدیث': 'HADITH_SCIENCES',
      'فقہ و فتاویٰ': 'FIQH_FATAWA',
      'عقائد': 'AQEEDAH',
      'سیرتِ نبوی ﷺ': 'SEERAH',
      'اسلامی تاریخ': 'ISLAMIC_HISTORY',
      'خاندانی و معاشرتی مسائل': 'FAMILY_SOCIAL_ISSUES',
      'تعلیم و تربیت': 'EDUCATION_UPBRINGING',
      'دعوت و اصلاح': 'DAWAH_REFORM',
      'متفرق اسلامی مضامین': 'MISC_ISLAMIC_TOPICS',
    };

    const pdfUrl = pub.pdf?.url || (typeof pub.pdf === 'string' ? pub.pdf : null);
    const coverUrl = pub.coverImage?.url || (typeof pub.coverImage === 'string' ? pub.coverImage : null);

    setFormFields({
      title: pub.title,
      summary: pub.summary,
      category: categoryMap[pub.category] || pub.category,
      blanguage: pub.blanguage || 'ur',
      author: pub.author,
      pageCount: pub.pageCount || '',
      tags: pub.tags ? pub.tags.join(', ') : '',
      references: pub.references ? pub.references.join(', ') : '',
    });
    setCoverImageFile(null);
    setPdfFile(null);
    setExistingPdfUrl(pdfUrl);
    setExistingCoverUrl(coverUrl);
    setPreviewUrl(null);
    setIsPreviewOpen(false);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    if (!editingId && !coverImageFile) {
      setActionError(language === 'en' ? 'Cover Image file is required' : 'سرورق تصویر کی فائل درکار ہے');
      setActionLoading(false);
      return;
    }
    if (!editingId && !pdfFile) {
      setActionError(language === 'en' ? 'PDF file is required' : 'پی ڈی ایف فائل درکار ہے');
      setActionLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', formFields.title);
    formData.append('summary', formFields.summary);
    formData.append('category', formFields.category);
    formData.append('blanguage', formFields.blanguage);
    formData.append('author', formFields.author);
    if (formFields.pageCount) {
      formData.append('pageCount', formFields.pageCount);
    }
    formData.append('tags', formFields.tags);
    formData.append('references', formFields.references);

    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }

    try {
      if (editingId) {
        await updatePublication(editingId, formData);
        showSuccess(language === 'en' ? 'Publication updated successfully.' : 'مطبوعہ کامیابی سے اپ ڈیٹ ہو گئی۔');
      } else {
        await createPublication(formData);
        showSuccess(language === 'en' ? 'Publication added successfully.' : 'مطبوعہ کامیابی سے شامل ہو گئی۔');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save publication');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this publication?' : 'کیا آپ واقعی اس مطبوعہ کو حذف کرنا چاہتے ہیں؟')) {
      setActionError(null);
      try {
        await deletePublication(id);
        showSuccess(language === 'en' ? 'Publication deleted successfully.' : 'مطبوعہ کامیابی سے حذف کر دی گئی۔');
      } catch (err) {
        setActionError(err.response?.data?.message || err.message || 'Failed to delete publication');
      }
    }
  };

  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    loadPublications();
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
              <h1 className="text-2xl font-bold text-primary font-serif">{language === 'en' ? 'Manage Publications' : 'مطبوعات کا انتظام'}</h1>
              <p className="text-xs text-slate-400 font-light">{language === 'en' ? 'Add, edit, or delete books and research papers.' : 'کتابیں اور تحقیقی مقالات شامل کریں، اپ ڈیٹ کریں یا حذف کریں'}</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif"
            >
              <Plus className="w-4 h-4 text-accent" />
              {language === 'en' ? 'Add Publication' : 'مطبوعہ شامل کریں'}
            </button>
          )}
        </div>

        {/* Success alert */}
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
                  ? (language === 'en' ? 'Edit Publication Details' : 'مطبوعہ کی تفصیلات میں ترمیم کریں') 
                  : (language === 'en' ? 'Add New Google Drive Publication' : 'گوگل ڈرائیو کی نئی مطبوعہ شامل کریں')
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
              
              {/* Alert error */}
              {actionError && (
                <div className={`bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Publication Title *' : 'مطبوعہ کا عنوان *'}</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Guidance on Principles of Fiqh' : 'مثال: اصول فقہ کی رہنمائی'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Author Name *' : 'مصنف کا نام *'}</label>
                  <Input
                    type="text"
                    name="author"
                    value={formFields.author}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Mufti Sahib / Dr. Scholar' : 'مثال: مفتی صاحب / ڈاکٹر صاحب'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Category & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <option key={cat.value} value={cat.value}>
                        {language === 'en' ? cat.labelEn : cat.labelUr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Language *' : 'زبان *'}</label>
                  <select
                    name="blanguage"
                    value={formFields.blanguage}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2.5 text-sm bg-slate-50 border border-border rounded outline-none text-slate-700 focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  >
                    {BOOK_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {language === 'en' ? lang.labelEn : lang.labelUr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Image File & PDF File */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Cover Image (JPEG/PNG)' : 'کتاب کا سرورق'} {!editingId && ' *'}
                  </label>
                  {coverImageFile ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 border border-dashed border-accent/40 rounded">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]" title={coverImageFile.name}>{coverImageFile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({(coverImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(coverImageFile);
                            setPreviewUrl(url);
                            setPreviewType('image');
                            setPreviewTitle(formFields.title || 'Cover Image Preview');
                            setIsPreviewOpen(true);
                          }}
                          className="flex-grow py-1 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          {language === 'en' ? 'Preview' : 'پیش نظارہ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImageFile(null)}
                          className="py-1 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-red-200"
                        >
                          {language === 'en' ? 'Remove' : 'حذف کریں'}
                        </button>
                      </div>
                    </div>
                  ) : existingCoverUrl ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImageFile(e.target.files[0])}
                        className={`w-full px-3 py-1.5 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingCoverUrl);
                          setPreviewType('image');
                          setPreviewTitle(formFields.title || 'Current Cover');
                          setIsPreviewOpen(true);
                        }}
                        className="py-1 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-border/40"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        {language === 'en' ? 'View Current Cover' : 'موجودہ سرورق دیکھیں'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverImageFile(e.target.files[0])}
                      required={!editingId}
                      className={`w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'PDF Document' : 'پی ڈی ایف کتاب'} {!editingId && ' *'}
                  </label>
                  {pdfFile ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 border border-dashed border-accent/40 rounded">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]" title={pdfFile.name}>{pdfFile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(pdfFile);
                            setPreviewUrl(url);
                            setPreviewType('pdf');
                            setPreviewTitle(formFields.title || 'PDF Preview');
                            setIsPreviewOpen(true);
                          }}
                          className="flex-grow py-1 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          {language === 'en' ? 'Preview' : 'پیش نظارہ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPdfFile(null)}
                          className="py-1 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-red-200"
                        >
                          {language === 'en' ? 'Remove' : 'حذف کریں'}
                        </button>
                      </div>
                    </div>
                  ) : existingPdfUrl ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        className={`w-full px-3 py-1.5 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingPdfUrl);
                          setPreviewType('pdf');
                          setPreviewTitle(formFields.title || 'Current PDF');
                          setIsPreviewOpen(true);
                        }}
                        className="py-1 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-border/40"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        {language === 'en' ? 'View Current PDF' : 'موجودہ پی ڈی ایف دیکھیں'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      required={!editingId}
                      className={`w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    />
                  )}
                </div>
              </div>

              {/* Page Count & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Page Count' : 'صفحات کی تعداد'}</label>
                  <Input
                    type="number"
                    name="pageCount"
                    value={formFields.pageCount}
                    onChange={handleInputChange}
                    min="1"
                    placeholder={language === 'en' ? 'e.g. 150' : 'مثال: 150'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Tags (separated by comma)' : 'ٹیگز (کوما سے الگ کریں)'}</label>
                  <Input
                    type="text"
                    name="tags"
                    value={formFields.tags}
                    onChange={handleInputChange}
                    placeholder={language === 'en' ? 'e.g. Aqeedah, Tauheed' : 'مثال: عقائد، توحید'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Short Summary *' : 'مختصر خلاصہ *'}</label>
                <textarea
                  name="summary"
                  value={formFields.summary}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Provide a brief overview of this book...' : 'اس کتاب کا مختصر جائزہ فراہم کریں...'}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'References / Sources (separated by comma)' : 'حوالہ جات / مراجع (کوما سے الگ کریں)'}</label>
                <textarea
                  name="references"
                  value={formFields.references}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g. Fath al-Bari, Hadith No. 123' : 'مثال: فتح الباری، حدیث نمبر 123'}
                  rows={2}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Action operations */}
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
                  {actionLoading ? (language === 'en' ? 'Saving...' : 'محفوظ کیا جا رہا ہے...') : (language === 'en' ? 'Save Book' : 'کتاب محفوظ کریں')}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Publications List Table */
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <Table
              loadingTableContent={loading}
              data={publications}
              noRecordText={language === 'en' ? 'No publications listed yet' : 'کوئی مطبوعہ درج نہیں ہے'}
              tableLayout={[
                {
                  headData: language === 'en' ? 'Title' : 'عنوان',
                  bodyData: (pub) => <span className={`font-bold font-serif max-w-xs truncate ${language === 'ur' ? 'text-right' : 'text-left'}`}>{pub.title}</span>,
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Author' : 'مصنف',
                  bodyData: (pub) => <span className={`font-light text-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>{pub.author}</span>,
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Category' : 'زمرہ',
                  bodyData: (pub) => (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                      {language === 'en' ? pub.category : (PUBLICATION_TRANSLATIONS[pub.category] || pub.category)}
                    </span>
                  ),
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Language' : 'زبان',
                  bodyData: (pub) => (
                    <span className={`text-xs font-semibold text-slate-500 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                      {language === 'en' ? pub.blanguage : (BOOK_LANGUAGE_TRANSLATIONS[pub.blanguage] || pub.blanguage)}
                    </span>
                  ),
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Actions' : 'اقدامات',
                  bodyData: (pub) => (
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(pub)}
                        className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors"
                        title={language === 'en' ? 'Edit' : 'ترمیم کریں'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pub._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={language === 'en' ? 'Delete' : 'حذف کریں'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                  tdClassName: language === 'ur' ? 'text-left' : 'text-right'
                }
              ]}
            />
          </div>
        )}

      </div>

      {isPreviewOpen && previewUrl && (
        <PdfViewer
          url={previewUrl}
          type={previewType}
          title={previewTitle}
          isModal={true}
          onClose={() => {
            setIsPreviewOpen(false);
            if (previewUrl.startsWith('blob:')) {
              URL.revokeObjectURL(previewUrl);
            }
          }}
        />
      )}
    </div>
  );
}
