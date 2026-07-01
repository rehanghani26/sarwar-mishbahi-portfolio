import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Save, AlertTriangle, Settings, CheckCircle, Info, PhoneCall, Globe, Search, User } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '../../../components/Input';
import { ImageViewer } from '@/components';

export default function ManageSettings() {
  const { settings, loading, error, updateSuccess, updateSettings, clearErrors } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [activeTab, setActiveTab] = useState('bio');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalStep, setModalStep] = useState('confirm'); // 'confirm' or 'success'


  // Form states mapping WebsiteSettings schema
  const [scholarInfo, setScholarInfo] = useState({
    fullName: '',
    title: '',
    photo: '',
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

  // Load database settings into local state inputs
  useEffect(() => {
    if (settings) {
      const info = settings.scholarInfo || {};
      setScholarInfo({
        fullName: info.fullName || '',
        title: info.title || '',
        photo: info.photo || '',
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
    clearErrors();
    setModalStep('confirm');
    setShowConfirmModal(true);
  };

  const confirmAndSave = async () => {
    setModalStep('success');

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
        photo: scholarInfo.photo,
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

    try {
      await updateSettings(payload);
    } catch (err) {
      console.error(err);
    }

    // Shows 2-second animated success state
    setTimeout(() => {
      setShowConfirmModal(false);
      setModalStep('confirm');
    }, 2000);
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'bio', label: language === 'en' ? 'Biography Details' : 'سوانح کی تفصیلات', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: language === 'en' ? 'Contact Details' : 'رابطے کی تفصیلات', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'socials', label: language === 'en' ? 'Social Network' : 'سوشل نیٹ ورک', icon: <Globe className="w-4 h-4" /> },
    { id: 'home', label: language === 'en' ? 'Homepage Hero' : 'ہوم پیج ہیرو', icon: <Settings className="w-4 h-4" /> },
    { id: 'seo', label: language === 'en' ? 'SEO Settings' : 'SEO ترتیبات', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className={`bg-background py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Module Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0">
              <ArrowRight className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">
                {language === 'en' ? 'Website Settings' : 'ویب سائٹ کی ترتیبات'}
              </h1>
              <p className="text-xs text-slate-400 font-light font-sans">
                {language === 'en' ? 'Change biography, contact numbers and SEO tags' : 'سوانح حیات، رابطے کے نمبرز اور SEO ٹیگز تبدیل کریں'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {updateSuccess && (
          <div className={`bg-emerald-50 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs ${language === 'ur' ? 'border-r-4 border-emerald-500' : 'border-l-4 border-emerald-500'}`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {language === 'en' ? 'Website settings updated successfully.' : 'ویب سائٹ کی ترتیبات کامیابی سے اپ ڈیٹ ہو گئیں۔'}
            </span>
          </div>
        )}
        {error && (
          <div className={`bg-red-50 p-4 flex items-start gap-2 text-red-700 text-xs shadow-xs ${language === 'ur' ? 'border-r-4 border-red-500' : 'border-l-4 border-red-500'}`}>
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Settings Tab Selector Bar */}
        <div className="flex flex-wrap border-b border-border/60 gap-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                clearErrors();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all uppercase tracking-wider font-serif ${activeTab === tab.id
                ? 'border-accent text-primary'
                : 'border-transparent text-slate-500 hover:text-accent'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Save Form */}
        <form onSubmit={handleFormSubmit} className={`bg-white border border-border p-6 rounded-lg shadow-sm space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}>

          {/* TAB 1: Biography Details */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Scholar Full Name' : 'عالم کا مکمل نام'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.fullName}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, fullName: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Honorary Title' : 'اعزازی اسلامی لقب/عنوان'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.title}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, title: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Scholar Photo URL' : 'عالم کی تصویر کا یو آر ایل'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.photo || ""}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, photo: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-1.5 self-center sm:self-start">
                    {language === 'en' ? 'Photo Preview' : 'تصویر کا پیش نظارہ'}
                  </span>
                  <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-1 min-h-[44px]">
                    {scholarInfo.photo ? (
                      <ImageViewer
                        src={scholarInfo.photo}
                        alt={scholarInfo.fullName || "Scholar Photo"}
                        thumbnailSize={2}
                        thumbnailBorderRadius="rounded"
                        thumbnailObjectFit="cover"
                        showZoomIcon={false}
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-100 rounded border border-dashed border-slate-300">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Detailed Biography' : 'تفصیلی سوانح عمری'}
                </label>
                <textarea
                  value={scholarInfo.bio}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, bio: e.target.value })}
                  rows={5}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Madrasah Education' : 'مدرسہ کی تعلیم'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.madrasah}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, madrasah: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'University Education' : 'یونیورسٹی کی تعلیم'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.university}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, university: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Qualifications (comma separated)' : 'تعلیمی اسناد (کوما سے الگ کریں)'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.qualifications}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, qualifications: e.target.value })}
                  placeholder={language === 'en' ? 'PhD Shariah, Masters Islamic Law' : 'پی ایچ ڈی شریعہ، ماسٹرز اسلامی قانون'}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Areas of Expertise (comma separated)' : 'مہارت کے شعبے (کوما سے الگ کریں)'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.areasOfExpertise}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, areasOfExpertise: e.target.value })}
                  placeholder={language === 'en' ? 'Fiqh, Hadith, Islamic Banking' : 'فقہ، حدیث، اسلامی بینکاری'}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Summary of Teaching Experience' : 'تدریسی تجربے کا خلاصہ'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.teachingExperience}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, teachingExperience: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Research Interests (comma separated)' : 'تحقیقی دلچسپیاں (کوما سے الگ کریں)'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.researchInterests}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, researchInterests: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Associated Institutions (comma separated)' : 'منسلک ادارے (کوما سے الگ کریں)'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.institutionsAssociatedWith}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, institutionsAssociatedWith: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Key Achievements (comma separated)' : 'اہم کامیابیاں (کوما سے الگ کریں)'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.achievements}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, achievements: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Contact Details */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Office Address' : 'دفتر کا پتہ'}
                </label>
                <Input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Phone Number' : 'فون نمبر'}
                  </label>
                  <Input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'WhatsApp Link / Number' : 'واٹس ایپ نمبر لنک'}
                  </label>
                  <Input
                    type="text"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Email Address' : 'ای میل ایڈریس'}
                </label>
                <Input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Social Links */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Facebook Profile Link' : 'فیس بک پروفائل کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/username"
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'YouTube Channel Link' : 'یوٹیوب چینل کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/channel/..."
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Twitter / X Link' : 'ٹویٹر / X کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/username"
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Instagram Link' : 'انسٹاگرام کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
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
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Hero Section Name' : 'ہیرو سیکشن کا نام'}
                  </label>
                  <Input
                    type="text"
                    value={homepageSettings.heroName}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroName: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Hero Section Title' : 'ہیرو سیکشن کا لقب/عہدہ'}
                  </label>
                  <Input
                    type="text"
                    value={homepageSettings.heroTitle}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroTitle: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Hero Section Intro Paragraph' : 'ہیرو سیکشن کا تعارفی پیراگراف'}
                </label>
                <textarea
                  value={homepageSettings.heroIntroduction}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroIntroduction: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Scholar Mission Statement' : 'عالم کا مشن سٹیٹمنٹ'}
                </label>
                <Input
                  type="text"
                  value={homepageSettings.heroMission}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroMission: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          )}

          {/* TAB 5: SEO settings */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Default Meta Title Tag' : 'ڈیفالٹ میٹا ٹائٹل ٹیگ'}
                </label>
                <Input
                  type="text"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Default Meta Description Tag' : 'ڈیفالٹ میٹا ڈسکرپشن ٹیگ'}
                </label>
                <textarea
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  rows={4}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>
            </div>
          )}

          {/* Form Action save control */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-start">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-accent" />
              {loading
                ? (language === 'en' ? 'Saving settings...' : 'ترتیبات محفوظ ہو رہی ہیں...')
                : (language === 'en' ? 'Save Settings' : 'ترتیبات محفوظ کریں')
              }
            </button>
          </div>

        </form>

      </div>

      {/* Confirmation & Success Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-backdrop-fade cursor-pointer"
            onClick={() => modalStep !== 'success' && setShowConfirmModal(false)}
          />
          
          {/* Modal Box */}
          <div 
            className={`relative bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full z-10 transition-all duration-300 transform animate-modal-entrance ${language === 'ur' ? 'text-right' : 'text-left'}`} 
            dir={language === 'ur' ? 'rtl' : 'ltr'}
          >
            {modalStep === 'confirm' ? (
              <div className="space-y-6">
                <div className={`flex items-start gap-4 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                      {language === 'en' ? 'Confirm Website Settings Update' : 'ویب سائٹ کی ترتیبات اپ ڈیٹ کی تصدیق'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'en' 
                        ? 'Are you sure you want to save the new biography, contact and SEO configuration?' 
                        : 'کیا آپ واقعی سوانح، رابطے اور SEO کی نئی ترتیبات محفوظ کرنا چاہتے ہیں؟'}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2.5 justify-end ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded transition-colors uppercase tracking-wider font-serif"
                  >
                    {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                  </button>
                  <button
                    type="button"
                    onClick={confirmAndSave}
                    className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded shadow transition-colors flex items-center gap-2 uppercase tracking-wider font-serif"
                  >
                    <Save className="w-4 h-4 text-accent" />
                    {language === 'en' ? 'Save Settings' : 'ترتیبات محفوظ کریں'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="success-checkmark-wrapper relative w-20 h-20">
                  <div className="success-circle absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                  <div className="success-circle-draw absolute inset-0 rounded-full border-4 border-emerald-500 animate-draw-circle" />
                  <div className="success-check-icon absolute inset-0 flex items-center justify-center text-emerald-500">
                    <svg className="w-10 h-10 stroke-current stroke-3 fill-none" viewBox="0 0 24 24">
                      <path 
                        className="animate-draw-check" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                  {language === 'en' ? 'Settings Saved Successfully!' : 'ترتیبات کامیابی سے محفوظ ہو گئیں!'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-light">
                  {language === 'en' 
                    ? 'The website layout and metadata have been updated.' 
                    : 'ویب سائٹ کی ظاہری شکل اور معلومات کامیابی سے تبدیل ہو چکی ہیں۔'}
                </p>
                
                {/* Custom style for 2-second draw/rotation animations */}
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes draw-circle {
                    0% { clip-path: polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%); }
                    25% { clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%); }
                    50% { clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%); }
                    75% { clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%); }
                    100% { clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%); }
                  }
                  @keyframes draw-check {
                    0% { stroke-dashoffset: 24; }
                    100% { stroke-dashoffset: 0; }
                  }
                  @keyframes backdrop-fade {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                  }
                  @keyframes modal-entrance {
                    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                  }
                  .animate-draw-circle {
                    animation: draw-circle 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                  }
                  .animate-draw-check {
                    stroke-dasharray: 24;
                    stroke-dashoffset: 24;
                    animation: draw-check 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
                  }
                  .animate-backdrop-fade {
                    animation: backdrop-fade 0.25s ease-out forwards;
                  }
                  .animate-modal-entrance {
                    animation: modal-entrance 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                  }
                  .stroke-3 {
                    stroke-width: 3.5px;
                  }
                `}} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

