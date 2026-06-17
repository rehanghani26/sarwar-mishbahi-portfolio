import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Save, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { fetchArticles, createArticle, updateArticle, deleteArticle, clearContentErrors } from '../../../store/slices/contentSlice';
import useTranslate from '../../../hooks/useTranslate';
import RichTextEditor from '../../../components/RichTextEditor';

export default function ManageArticles() {
  const dispatch = useDispatch();
  const { t, isUrdu } = useTranslate();

  const { list: articles, loading } = useSelector((state) => state.content.articles);
  const { actionLoading, actionError } = useSelector((state) => state.content);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields State
  const [formFields, setFormFields] = useState({
    title: '',
    summary: '',
    category: 'Fiqh',
    tags: '',
    featuredImage: '',
    fullContent: '',
    references: '',
  });

  const categories = [
    'Quran',
    'Hadith',
    'Fiqh',
    'Aqeedah',
    'Seerah',
    'Islamic History',
    'Family Matters',
    'Education',
    'Dawah',
    'General Islam',
  ];

  useEffect(() => {
    dispatch(fetchArticles({ limit: 100 })); // Load a larger set for management
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (htmlContent) => {
    setFormFields((prev) => ({ ...prev, fullContent: htmlContent }));
  };

  const openCreateForm = () => {
    dispatch(clearContentErrors());
    setEditingId(null);
    setFormFields({
      title: '',
      summary: '',
      category: 'Fiqh',
      tags: '',
      featuredImage: '',
      fullContent: '',
      references: '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (article) => {
    dispatch(clearContentErrors());
    setEditingId(article._id);
    setFormFields({
      title: article.title,
      summary: article.summary,
      category: article.category,
      tags: article.tags ? article.tags.join(', ') : '',
      featuredImage: article.featuredImage || '',
      fullContent: article.fullContent,
      references: article.references ? article.references.join('\n') : '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearContentErrors());

    const payload = {
      ...formFields,
      tags: formFields.tags.split(',').map((t) => t.trim()).filter((t) => t),
      references: formFields.references.split('\n').map((r) => r.trim()).filter((r) => r),
    };

    let result;
    if (editingId) {
      result = await dispatch(updateArticle({ id: editingId, articleData: payload }));
      if (updateArticle.fulfilled.match(result)) {
        showSuccess('Article updated successfully.');
      }
    } else {
      result = await dispatch(createArticle(payload));
      if (createArticle.fulfilled.match(result)) {
        showSuccess('Article created successfully.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(clearContentErrors());
      const result = await dispatch(deleteArticle(id));
      if (deleteArticle.fulfilled.match(result)) {
        showSuccess('Article removed successfully.');
      }
    }
  };

  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    dispatch(fetchArticles({ limit: 100 }));
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-[#FAF9F5] py-10 min-h-[80vh]" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Module Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3CF]/50 pb-5 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-[#EAE3CF] bg-white rounded text-slate-500 hover:text-[#8A6F52] shrink-0">
              <ArrowLeft className={`w-4.5 h-4.5 ${isUrdu ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#2F241C] font-serif">{t('Manage Articles')}</h1>
              <p className="text-xs text-slate-400 font-light">{t('Add, update, or remove scholar articles') || 'Add, update, or remove scholar articles'}</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2F241C] hover:bg-[#1E1915] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif"
            >
              <Plus className="w-4 h-4 text-[#8A6F52]" />
              {t('Write Article')}
            </button>
          )}
        </div>

        {/* Action success alert banner */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms vs List router */}
        {isFormOpen ? (
          <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#2F241C] islamic-pattern text-white px-6 py-4 border-b border-[#8A6F52]/35 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-md font-serif">
                {editingId ? t('Edit Scholarly Article') : t('Write New Scholarly Article')}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#EAE3CF] hover:text-white underline font-light"
              >
                {t('Cancel')}
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Form action errors */}
              {actionError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Article Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter article heading title..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category *</label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none text-slate-700 focus:border-[#8A6F52]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Brief Summary *</label>
                <input
                  type="text"
                  name="summary"
                  value={formFields.summary}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter a 2-3 sentence teaser summary of the article..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all"
                />
              </div>

              {/* Tags & Featured Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formFields.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. Fiqh, Zakat, Modern Business"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    name="featuredImage"
                    value={formFields.featuredImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Article Content (Rich Editor) *</label>
                <RichTextEditor
                  value={formFields.fullContent}
                  onChange={handleEditorChange}
                  placeholder="Draft your scholarly Islamic content here..."
                />
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">References / Classical Sources (One Per Line)</label>
                <textarea
                  name="references"
                  value={formFields.references}
                  onChange={handleInputChange}
                  placeholder="e.g. Sahih al-Bukhari, Hadith 456&#10;Al-Mughni by Ibn Qudamah"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] focus:bg-white transition-all resize-y"
                ></textarea>
              </div>

              {/* Form CTA buttons */}
              <div className={`pt-4 border-t border-slate-100 flex items-center ${isUrdu ? 'justify-start' : 'justify-end'} gap-3`}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
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
                  {actionLoading ? t('Saving...') : t('Save Article')}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Articles List Table */
          <div className="bg-white border border-[#EAE3CF] rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-[#EAE3CF]">
                      <th className={`px-6 py-4 ${isUrdu ? 'text-right' : 'text-left'}`}>{t('Title')}</th>
                      <th className={`px-6 py-4 ${isUrdu ? 'text-right' : 'text-left'}`}>{t('Category')}</th>
                      <th className={`px-6 py-4 ${isUrdu ? 'text-right' : 'text-left'}`}>{t('Publish Date')}</th>
                      <th className="px-6 py-4 text-center">{t('Views')}</th>
                      <th className={`px-6 py-4 ${isUrdu ? 'text-left text-left' : 'text-right'}`}>{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {articles.map((article) => (
                      <tr key={article._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold font-serif max-w-xs truncate">{article.title}</td>
                        <td className="px-6 py-4">
                          <span className="bg-[#2F241C]/10 text-[#2F241C] text-[10px] font-bold px-2 py-0.5 rounded">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-light text-xs">
                          {new Date(article.publishDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-xs text-[#8A6F52]">
                          {article.viewCount || 0}
                        </td>
                        <td className={`px-6 py-4 ${isUrdu ? 'text-left' : 'text-right'}`}>
                          <div className="inline-flex items-center gap-2">
                             <button
                               onClick={() => openEditForm(article)}
                               className="p-1.5 text-[#8A6F52] hover:bg-amber-50 rounded transition-colors"
                               title={t('Edit Article')}
                             >
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button
                               onClick={() => handleDelete(article._id)}
                               className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                               title={t('Delete Article')}
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
                <FileText className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 font-serif">No Articles Written</h3>
                <p className="text-slate-400 text-xs mt-1">Click the "Write Article" button to publish your first post.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
