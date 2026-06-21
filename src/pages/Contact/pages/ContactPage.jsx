import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Send, MessageSquareCode, CheckCircle2, AlertTriangle, Facebook, Youtube, Twitter, Instagram } from 'lucide-react';
import { submitContact, clearContentErrors } from '../../../store/slices/contentSlice';
import { Input } from '../../../components/Input';

export default function ContactPage() {
  const dispatch = useDispatch();
  const { actionLoading, actionError } = useSelector((state) => state.content);
  const { settings } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearContentErrors());

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return;
    }

    const result = await dispatch(submitContact(formData));
    if (submitContact.fulfilled.match(result)) {
      setSuccess(true);
      setSuccessMsg(result.payload.message || 'آپ کا پیغام کامیابی کے ساتھ درج کر لیا گیا ہے۔');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }
  };

  // Contacts fallback defaults
  const address = settings?.contactInfo?.address || '';
  const phone = settings?.contactInfo?.phone || '';
  const whatsapp = settings?.contactInfo?.whatsapp || '';
  const email = settings?.contactInfo?.email || '';
  const socialLinks = settings?.socialLinks || {};

  return (
    <div className="bg-[#FAF9F5] dark:bg-slate-900 py-12 min-h-screen text-right">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Side: Contact Information Cards (5 columns) */}
        <div className="lg:col-span-5 space-y-6 text-right">
          <div>
            <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest block mb-1 font-serif text-right">رابطہ کریں</span>
            <h1 className="text-3xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif tracking-wide text-right">رابطے کی تفصیلات</h1>
            <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 leading-relaxed text-right">
              اگر آپ کے پاس فتاویٰ، کتب، دعوت ناموں یا خطابات کے بارے میں کوئی سوال ہے تو سرکاری رابطہ پورٹل کے ذریعے رابطہ کریں۔
            </p>
          </div>

          <div className="premium-card p-6 space-y-6 text-right">

            {/* Address */}
            <div className="flex gap-4 items-start text-right">
              <div className="p-2.5 rounded bg-[#2F241C]/5 dark:bg-amber-950/20 text-[#2F241C] dark:text-[#8A6F52] border border-[#2F241C]/10 dark:border-[#8A6F52]/20 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">دفتر کا پتہ</span>
                <p className="text-slate-700 dark:text-slate-350 text-sm mt-1 leading-relaxed font-light text-right">{address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 items-start text-right">
              <div className="p-2.5 rounded bg-[#2F241C]/5 dark:bg-amber-950/20 text-[#2F241C] dark:text-[#8A6F52] border border-[#2F241C]/10 dark:border-[#8A6F52]/20 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">فون نمبرز</span>
                <p className="text-slate-700 dark:text-slate-350 text-sm mt-1 font-light text-right">دفتر: {phone}</p>
                {whatsapp && <p className="text-[#8A6F52] dark:text-amber-400 text-xs font-semibold mt-1 text-right">واٹس ایپ لنک: {whatsapp}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start text-right">
              <div className="p-2.5 rounded bg-[#2F241C]/5 dark:bg-amber-950/20 text-[#2F241C] dark:text-[#8A6F52] border border-[#2F241C]/10 dark:border-[#8A6F52]/20 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">ای ای میل ایڈریس</span>
                <p className="text-slate-700 dark:text-slate-350 text-sm mt-1 font-light text-right">{email}</p>
              </div>
            </div>

          </div>

          {/* Social icons */}
          <div className="bg-[#2F241C] islamic-pattern text-white p-6 rounded-lg border border-[#8A6F52]/35 relative overflow-hidden shadow-sm text-right">
            <h3 className="font-bold text-md mb-3 font-serif text-right">سوشل میڈیا پر جڑیں</h3>
            <p className="text-xs text-slate-300 mb-4 font-light text-right">باقاعدہ ویڈیو بیانات اور اپ ڈیٹس کے لیے ہمارے سوشل میڈیا پیجز فالو کریں۔</p>
            <div className="flex items-center gap-2.5 relative z-10 justify-start">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded bg-[#1E1915] text-[#8A6F52] hover:bg-[#2F241C] border border-[#8A6F52]/30 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded bg-[#1E1915] text-[#8A6F52] hover:bg-[#2F241C] border border-[#8A6F52]/30 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded bg-[#1E1915] text-[#8A6F52] hover:bg-[#2F241C] border border-[#8A6F52]/30 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded bg-[#1E1915] text-[#8A6F52] hover:bg-[#2F241C] border border-[#8A6F52]/30 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Message Submission Form (7 columns) */}
        <div className="lg:col-span-7 text-right">
          {success ? (
            <div className="premium-card p-10 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
              <CheckCircle2 className="w-16 h-16 text-[#8A6F52] dark:text-[#8A6F52] mb-4" />
              <h2 className="text-2xl font-bold text-[#2F241C] dark:text-[#8A6F52] font-serif mb-3">پیغام موصول ہو گیا</h2>
              <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed max-w-sm font-light mb-6">
                {successMsg} ہمارا انتظامی دفتر اس کا جائزہ لے گا اور جلد از جلد جواب دے گا۔
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-5 py-2.5 bg-[#2F241C] text-white text-xs font-bold rounded uppercase tracking-wider font-serif hover:bg-[#1E1915] transition-colors"
              >
                ایک اور پیغام بھیجیں
              </button>
            </div>
          ) : (
            <div className="premium-card shadow-sm p-6 sm:p-8 text-right">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif mb-6 border-b border-slate-100 dark:border-slate-750 pb-3 flex items-center gap-2 text-right">
                <MessageSquareCode className="w-5 h-5 text-[#8A6F52] dark:text-amber-500" />
                پیغام بھیجیں
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-right">

                {/* Alert error */}
                {actionError && (
                  <div className="bg-red-50 dark:bg-red-950/20 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 dark:text-red-400 text-xs shrink-0 text-right">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 text-right">آپ کا نام *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="مثال: عبداللہ"
                      inputClassName="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 text-right"
                      border=""
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 text-right">آپ کا ای میل ایڈریس *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="abdullah@example.com"
                      inputClassName="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 text-right"
                      border=""
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 text-right">موضوع *</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: سیمینار کی دعوت / فقہی سوال"
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 text-right"
                    border=""
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 text-right">آپ کا پیغام *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="اپنا پیغام یہاں لکھیں..."
                    rows={6}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all resize-y placeholder:text-slate-400 text-right"
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F241C] hover:bg-[#1E1915] dark:bg-[#2F241C] dark:hover:bg-[#1E1915] text-white font-bold rounded shadow-sm transition-all uppercase tracking-wider font-serif text-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#8A6F52]" />
                    {actionLoading ? 'پیغام بھیجا جا رہا ہے...' : 'پیغام بھیجیں'}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
