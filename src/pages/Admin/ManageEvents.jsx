import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/event';
import { useSettings } from '../../../context/SettingsContext';
import { Input } from '../../components/Input';

export default function ManageEvents() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [events, setEvents] = useState([]);
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
    description: '',
    eventDate: '',
    location: '',
    posterImage: '',
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : (data.events || []));
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
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
      description: '',
      eventDate: '',
      location: '',
      posterImage: '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (ev) => {
    setActionError(null);
    setEditingId(ev._id);

    // Format date string for datetime-local input (YYYY-MM-DDTHH:MM)
    const formattedDate = ev.eventDate
      ? new Date(ev.eventDate).toISOString().slice(0, 16)
      : '';

    setFormFields({
      title: ev.title,
      description: ev.description,
      eventDate: formattedDate,
      location: ev.location,
      posterImage: ev.posterImage || '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    try {
      if (editingId) {
        await updateEvent(editingId, formFields);
        showSuccess(language === 'en' ? 'Event updated successfully.' : 'پروگرام کامیابی سے اپ ڈیٹ ہو گیا۔');
      } else {
        await createEvent(formFields);
        showSuccess(language === 'en' ? 'Event added successfully.' : 'پروگرام کامیابی سے شامل ہو گیا۔');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this event?' : 'کیا آپ واقعی اس پروگرام کو حذف کرنا چاہتے ہیں؟')) {
      setActionError(null);
      try {
        await deleteEvent(id);
        showSuccess(language === 'en' ? 'Event deleted successfully.' : 'پروگرام کامیابی سے حذف کر دیا گیا۔');
      } catch (err) {
        setActionError(err.response?.data?.message || err.message || 'Failed to delete event');
      }
    }
  };

  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    loadEvents();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className={`bg-[#FAF7F2] py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Module Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5D8CA]/50 pb-5 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-[#E5D8CA] bg-white rounded text-slate-500 hover:text-[#B08D57] shrink-0">
              <ArrowRight className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#1F3A5F] font-serif">{language === 'en' ? 'Manage Events' : 'پروگراموں کا انتظام'}</h1>
              <p className="text-xs text-slate-400 font-light">{language === 'en' ? 'Add, edit, or delete scheduled events and gatherings.' : 'طے شدہ پروگرام اور اجتماعات شامل کریں، اپ ڈیٹ کریں یا حذف کریں'}</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1F3A5F] hover:bg-[#162C49] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif"
            >
              <Plus className="w-4 h-4 text-[#B08D57]" />
              {language === 'en' ? 'Add Event' : 'پروگرام شامل کریں'}
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
          <div className="bg-white border border-[#E5D8CA] rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#1F3A5F] islamic-pattern text-white px-6 py-4 border-b border-[#B08D57]/35 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-md font-serif">
                {editingId 
                  ? (language === 'en' ? 'Edit Event Details' : 'پروگرام کی تفصیلات میں ترمیم کریں') 
                  : (language === 'en' ? 'Add New Educational Event' : 'نیا تعلیمی پروگرام شامل کریں')
                }
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#E5D8CA] hover:text-white underline font-light"
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

              {/* Title & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Event Title *' : 'پروگرام کا عنوان *'}</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Halal Investment Workshop Seminar' : 'مثال: حلال سرمایہ کاری ورکشاپ سیمینار'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-[#E5D8CA] rounded outline-none focus:border-[#B08D57] focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Event Date & Time *' : 'پروگرام کی تاریخ اور وقت *'}</label>
                  <Input
                    type="datetime-local"
                    name="eventDate"
                    value={formFields.eventDate}
                    onChange={handleInputChange}
                    required
                    inputClassName={`w-full px-3 py-2.5 text-sm bg-slate-50 border border-[#E5D8CA] rounded outline-none text-slate-700 focus:border-[#B08D57] ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Location & Poster Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Event Location *' : 'پروگرام کا مقام *'}</label>
                  <Input
                    type="text"
                    name="location"
                    value={formFields.location}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Masjid Noor, Seminar Hall A' : 'مثال: مسجد نور، سیمینار ہال الف'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-[#E5D8CA] rounded outline-none focus:border-[#B08D57] focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Poster Image URL (Optional)' : 'پوسٹر امیج یو آر ایل (اختیاری)'}</label>
                  <Input
                    type="text"
                    name="posterImage"
                    value={formFields.posterImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/poster.jpg"
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-[#E5D8CA] rounded outline-none focus:border-[#B08D57] focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Short Description *' : 'مختصر تفصیل *'}</label>
                <textarea
                  name="description"
                  value={formFields.description}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Provide details about topics, timings, registration fee, etc...' : 'اجتماع کے موضوعات، اوقات اور اگر کوئی رجسٹریشن فیس ہو تو اس کے بارے میں تفصیلات فراہم کریں...'}
                  rows={5}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-[#E5D8CA] rounded outline-none focus:border-[#B08D57] focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-[#E5D8CA] text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif"
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#1F3A5F] hover:bg-[#162C49] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-[#B08D57]" />
                  {actionLoading ? 'محفوظ ہو رہا ہے...' : 'پروگرام محفوظ کریں'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Events List Table */
          <div className="bg-white border border-[#E5D8CA] rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A5F]"></div>
              </div>
            ) : events && events.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-[#E5D8CA]">
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{language === 'en' ? 'Title' : 'عنوان'}</th>
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{language === 'en' ? 'Date' : 'تاریخ'}</th>
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{language === 'en' ? 'Location' : 'مقام'}</th>
                      <th className={`px-6 py-4 ${language === 'ur' ? 'text-left' : 'text-right'}`}>{language === 'en' ? 'Actions' : 'اقدامات'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {events.map((ev) => (
                      <tr key={ev._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className={`px-6 py-4 font-bold font-serif max-w-xs truncate ${language === 'ur' ? 'text-right' : 'text-left'}`}>{ev.title}</td>
                        <td className={`px-6 py-4 font-light text-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                          {new Date(ev.eventDate).toLocaleString(language === 'ur' ? 'ur-PK' : 'en-US')}
                        </td>
                        <td className={`px-6 py-4 text-xs font-light max-w-xs truncate text-slate-500 ${language === 'ur' ? 'text-right' : 'text-left'}`}>{ev.location}</td>
                        <td className={`px-6 py-4 ${language === 'ur' ? 'text-left' : 'text-right'}`}>
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(ev)}
                              className="p-1.5 text-[#B08D57] hover:bg-amber-50 rounded transition-colors"
                              title={language === 'en' ? 'Edit' : 'ترمیم کریں'}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(ev._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title={language === 'en' ? 'Delete' : 'حذف کریں'}
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
                <Calendar className="w-12 h-12 text-[#B08D57] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 font-serif">{language === 'en' ? 'No events scheduled yet' : 'کوئی پروگرام طے شدہ نہیں ہے'}</h3>
                <p className="text-slate-400 text-xs mt-1">{language === 'en' ? 'Click "Add Event" button to schedule your first event.' : 'اپنا پہلا پروگرام شیڈول کرنے کے لیے "پروگرام شامل کریں" بٹن پر کلک کریں۔'}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

