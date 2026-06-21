import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Save, AlertTriangle, Settings, CheckCircle, Info, PhoneCall, Globe, Search } from 'lucide-react';
import { fetchSettings, updateSettings, clearSettingsErrors } from '../../../store/slices/settingsSlice';
import { Input } from '../../../components/Input';

export default function ManageSettings() {
  const dispatch = useDispatch();
  const { settings, loading, error, updateSuccess, isSettingsLoaded } = useSelector((state) => state.settings);

  const [activeTab, setActiveTab] = useState('bio');


  // Form states mapping WebsiteSettings schema
  const [scholarInfo, setScholarInfo] = useState({
    fullName: '',
    title: '',
    bio: '',
    madrasah: '',
    university: '',
    qualifications: '',
    areasOfExpertise: '',
    teachingExperience: '',
    researchInterests: '',
    institutionsAssociatedWith: '',
    achievements: '',
  });

  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    youtube: '',
    twitter: '',
    instagram: '',
  });

  const [homepageSettings, setHomepageSettings] = useState({
    heroName: '',
    heroTitle: '',
    heroIntroduction: '',
    heroMission: '',
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    if (!isSettingsLoaded) {
      dispatch(fetchSettings());
    }
  }, [dispatch, isSettingsLoaded]);

  // Load database settings into local state inputs
  useEffect(() => {
    if (settings) {
      const info = settings.scholarInfo || {};
      setScholarInfo({
        fullName: info.fullName || '',
        title: info.title || '',
        bio: info.bio || '',
        madrasah: info.education?.madrasah || '',
        university: info.education?.university || '',
        qualifications: info.qualifications ? info.qualifications.join(', ') : '',
        areasOfExpertise: info.areasOfExpertise ? info.areasOfExpertise.join(', ') : '',
        teachingExperience: info.teachingExperience || '',
        researchInterests: info.researchInterests ? info.researchInterests.join(', ') : '',
        institutionsAssociatedWith: info.institutionsAssociatedWith ? info.institutionsAssociatedWith.join(', ') : '',
        achievements: info.achievements ? info.achievements.join(', ') : '',
      });

      const contact = settings.contactInfo || {};
      setContactInfo({
        address: contact.address || '',
        phone: contact.phone || '',
        whatsapp: contact.whatsapp || '',
        email: contact.email || '',
      });

      const socials = settings.socialLinks || {};
      setSocialLinks({
        facebook: socials.facebook || '',
        youtube: socials.youtube || '',
        twitter: socials.twitter || '',
        instagram: socials.instagram || '',
      });

      const home = settings.homepageSettings || {};
      setHomepageSettings({
        heroName: home.heroName || '',
        heroTitle: home.heroTitle || '',
        heroIntroduction: home.heroIntroduction || '',
        heroMission: home.heroMission || '',
      });

      const seo = settings.seoSettings || {};
      setSeoSettings({
        metaTitle: seo.metaTitle || '',
        metaDescription: seo.metaDescription || '',
      });
    }
  }, [settings]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearSettingsErrors());

    const splitHelper = (str) =>
      str
        ? str
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s)
          : [];

    const payload = {
      scholarInfo: {
        fullName: scholarInfo.fullName,
        title: scholarInfo.title,
        bio: scholarInfo.bio,
        education: {
          madrasah: scholarInfo.madrasah,
          university: scholarInfo.university,
        },
        qualifications: splitHelper(scholarInfo.qualifications),
        areasOfExpertise: splitHelper(scholarInfo.areasOfExpertise),
        teachingExperience: scholarInfo.teachingExperience,
        researchInterests: splitHelper(scholarInfo.researchInterests),
        institutionsAssociatedWith: splitHelper(scholarInfo.institutionsAssociatedWith),
        achievements: splitHelper(scholarInfo.achievements),
      },
      contactInfo,
      socialLinks,
      homepageSettings,
      seoSettings,
    };

    dispatch(updateSettings(payload));
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-[#FAF9F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'bio', label: 'سوانح کی تفصیلات', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'رابطے کی تفصیلات', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'socials', label: 'سوشل نیٹ ورک', icon: <Globe className="w-4 h-4" /> },
    { id: 'home', label: 'ہوم پیج ہیرو', icon: <Settings className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO ترتیبات', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#FAF9F5] py-10 min-h-[80vh]" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Module Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3CF]/50 pb-5 text-right">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-[#EAE3CF] bg-white rounded text-slate-500 hover:text-[#8A6F52] shrink-0">
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#2F241C] font-serif">ویب سائٹ کی ترتیبات</h1>
              <p className="text-xs text-slate-400 font-light font-sans">سوانح حیات، رابطے کے نمبرز اور SEO ٹیگز تبدیل کریں</p>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {updateSuccess && (
          <div className="bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>ویب سائٹ کی ترتیبات کامیابی سے اپ ڈیٹ ہو گئیں۔</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shadow-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Settings Tab Selector Bar */}
        <div className="flex flex-wrap border-b border-[#EAE3CF]/60 gap-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                dispatch(clearSettingsErrors());
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all uppercase tracking-wider font-serif ${activeTab === tab.id
                ? 'border-[#8A6F52] text-[#2F241C]'
                : 'border-transparent text-slate-500 hover:text-[#8A6F52]'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Save Form */}
        <form onSubmit={handleFormSubmit} className="bg-white border border-[#EAE3CF] p-6 rounded-lg shadow-sm space-y-6 text-right">

          {/* TAB 1: Biography Details */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">عالم کا مکمل نام</label>
                  <Input
                    type="text"
                    value={scholarInfo.fullName}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, fullName: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">اعزازی اسلامی لقب/عنوان</label>
                  <Input
                    type="text"
                    value={scholarInfo.title}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, title: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">تفصیلی سوانح عمری</label>
                <textarea
                  value={scholarInfo.bio}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, bio: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] resize-y text-right"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">مدرسہ کی تعلیم</label>
                  <Input
                    type="text"
                    value={scholarInfo.madrasah}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, madrasah: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">یونیورسٹی کی تعلیم</label>
                  <Input
                    type="text"
                    value={scholarInfo.university}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, university: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">تعلیمی اسناد (کوما سے الگ کریں)</label>
                <Input
                  type="text"
                  value={scholarInfo.qualifications}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, qualifications: e.target.value })}
                  placeholder="پی ایچ ڈی شریعہ، ماسٹرز اسلامی قانون"
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">مہارت کے شعبے (کوما سے الگ کریں)</label>
                <Input
                  type="text"
                  value={scholarInfo.areasOfExpertise}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, areasOfExpertise: e.target.value })}
                  placeholder="فقہ، حدیث، اسلامی بینکاری"
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">تدریسی تجربے کا خلاصہ</label>
                <Input
                  type="text"
                  value={scholarInfo.teachingExperience}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, teachingExperience: e.target.value })}
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">تحقیقی دلچسپیاں (کوما سے الگ کریں)</label>
                  <Input
                    type="text"
                    value={scholarInfo.researchInterests}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, researchInterests: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">منسلک ادارے (کوما سے الگ کریں)</label>
                  <Input
                    type="text"
                    value={scholarInfo.institutionsAssociatedWith}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, institutionsAssociatedWith: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">اہم کامیابیاں (کوما سے الگ کریں)</label>
                <Input
                  type="text"
                  value={scholarInfo.achievements}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, achievements: e.target.value })}
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Contact Details */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">دفتر کا پتہ</label>
                <Input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">فون نمبر</label>
                  <Input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">واٹس ایپ نمبر لنک</label>
                  <Input
                    type="text"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ای میل ایڈریس</label>
                <Input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Social Links */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">فیس بک پروفائل کا لنک</label>
                  <Input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/username"
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">یوٹیوب چینل کا لنک</label>
                  <Input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/channel/..."
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ٹویٹر / X کا لنک</label>
                  <Input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/username"
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">انسٹاگرام کا لنک</label>
                  <Input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Homepage settings */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ہیرو سیکشن کا نام</label>
                  <Input
                    type="text"
                    value={homepageSettings.heroName}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroName: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ہیرو سیکشن کا لقب/عہدہ</label>
                  <Input
                    type="text"
                    value={homepageSettings.heroTitle}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroTitle: e.target.value })}
                    border=""
                    inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ہیرو سیکشن کا تعارفی پیراگراف</label>
                <textarea
                  value={homepageSettings.heroIntroduction}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroIntroduction: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] resize-y text-right"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">عالم کا مشن سٹیٹمنٹ</label>
                <Input
                  type="text"
                  value={homepageSettings.heroMission}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroMission: e.target.value })}
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SEO settings */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ڈیفالٹ میٹا ٹائٹل ٹیگ</label>
                <Input
                  type="text"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  border=""
                  inputClassName="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ڈیفالٹ میٹا ڈسکرپشن ٹیگ</label>
                <textarea
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] resize-y text-right"
                ></textarea>
              </div>
            </div>
          )}



          {/* Form Action save control */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-start">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#2F241C] hover:bg-[#1E1915] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#8A6F52]" />
              {loading ? 'ترتیبات محفوظ ہو رہی ہیں...' : 'ترتیبات محفوظ کریں'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

