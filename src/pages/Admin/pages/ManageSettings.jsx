import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle, Settings, CheckCircle, Info, PhoneCall, Globe, Search } from 'lucide-react';
import { fetchSettings, updateSettings, clearSettingsErrors, setLocalLanguage, setLocalEnglishFont, setLocalUrduFont } from '../../../store/slices/settingsSlice';
import useTranslate from '../../../hooks/useTranslate';

export default function ManageSettings() {
  const dispatch = useDispatch();
  const { settings, loading, error, updateSuccess } = useSelector((state) => state.settings);
  const { t, isUrdu } = useTranslate();

  const [activeTab, setActiveTab] = useState('bio');
  const [language, setLanguage] = useState('English');
  const [englishFont, setEnglishFont] = useState('Inter');
  const [urduFont, setUrduFont] = useState('Noto Nastaliq Urdu');

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem('site_language', value);
    dispatch(setLocalLanguage(value));
  };

  const handleEnglishFontChange = (value) => {
    setEnglishFont(value);
    localStorage.setItem('site_english_font', value);
    dispatch(setLocalEnglishFont(value));
  };

  const handleUrduFontChange = (value) => {
    setUrduFont(value);
    localStorage.setItem('site_urdu_font', value);
    dispatch(setLocalUrduFont(value));
  };

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
    dispatch(fetchSettings());
  }, [dispatch]);

  // Load database settings into local state inputs
  useEffect(() => {
    if (settings) {
      setLanguage(settings.language || 'English');
      setEnglishFont(settings.englishFont || 'Inter');
      setUrduFont(settings.urduFont || 'Noto Nastaliq Urdu');
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
    { id: 'bio', label: t('Biography Details'), icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: t('Contact Details'), icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'socials', label: t('Social Networks'), icon: <Globe className="w-4 h-4" /> },
    { id: 'home', label: t('Home Page Hero'), icon: <Settings className="w-4 h-4" /> },
    { id: 'seo', label: t('SEO Settings'), icon: <Search className="w-4 h-4" /> },
    { id: 'lang', label: t('Language Settings'), icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#FAF9F5] py-10 min-h-[80vh]" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Module Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3CF]/50 pb-5 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-[#EAE3CF] bg-white rounded text-slate-500 hover:text-[#8A6F52] shrink-0">
              <ArrowLeft className={`w-4.5 h-4.5 ${isUrdu ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#2F241C] font-serif">{t('Website Settings')}</h1>
              <p className="text-xs text-slate-400 font-light font-sans">{t('Modify biography profiles, contact numbers, and SEO tags')}</p>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {updateSuccess && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{t('Website settings updated successfully.') || 'Website settings updated successfully.'}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shadow-xs">
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
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all uppercase tracking-wider font-serif ${
                activeTab === tab.id
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
        <form onSubmit={handleFormSubmit} className="bg-white border border-[#EAE3CF] p-6 rounded-lg shadow-sm space-y-6">
          
          {/* TAB 1: Biography Details */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Scholar Full Name')}</label>
                  <input
                    type="text"
                    value={scholarInfo.fullName}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Honorary Islamic Title')}</label>
                  <input
                    type="text"
                    value={scholarInfo.title}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Detailed Biography Statement')}</label>
                <textarea
                  value={scholarInfo.bio}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, bio: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] resize-y"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Madrasah Education')}</label>
                  <input
                    type="text"
                    value={scholarInfo.madrasah}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, madrasah: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('University Education')}</label>
                  <input
                    type="text"
                    value={scholarInfo.university}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, university: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Qualifications (Comma Separated)')}</label>
                <input
                  type="text"
                  value={scholarInfo.qualifications}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, qualifications: e.target.value })}
                  placeholder="PhD in Shariah, Masters in Islamic Law"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Areas of Expertise (Comma Separated)')}</label>
                <input
                  type="text"
                  value={scholarInfo.areasOfExpertise}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, areasOfExpertise: e.target.value })}
                  placeholder="Fiqh, Hadith, Islamic Banking"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Teaching Experience Synopsis')}</label>
                <input
                  type="text"
                  value={scholarInfo.teachingExperience}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, teachingExperience: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Research Interests (Comma Separated)')}</label>
                  <input
                    type="text"
                    value={scholarInfo.researchInterests}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, researchInterests: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Associated Institutions (Comma Separated)')}</label>
                  <input
                    type="text"
                    value={scholarInfo.institutionsAssociatedWith}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, institutionsAssociatedWith: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Key Achievements (Comma Separated)')}</label>
                <input
                  type="text"
                  value={scholarInfo.achievements}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, achievements: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Contact Details */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Office Address')}</label>
                <input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Phone Number')}</label>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('WhatsApp Number Link')}</label>
                  <input
                    type="text"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Email Address')}</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Social Links */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Facebook Profile URL')}</label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/username"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('YouTube Channel URL')}</label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/channel/..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Twitter / X URL')}</label>
                  <input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/username"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Instagram URL')}</label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
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
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Hero Title Name')}</label>
                  <input
                    type="text"
                    value={homepageSettings.heroName}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Hero Title Designation')}</label>
                  <input
                    type="text"
                    value={homepageSettings.heroTitle}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Hero Introduction Paragraph')}</label>
                <textarea
                  value={homepageSettings.heroIntroduction}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroIntroduction: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] resize-y"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Scholar Mission Statement Text')}</label>
                <input
                  type="text"
                  value={homepageSettings.heroMission}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroMission: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SEO settings */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Default Meta Title Tag')}</label>
                <input
                  type="text"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Default Meta Description Tag')}</label>
                <textarea
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#EAE3CF] rounded outline-none focus:border-[#8A6F52] resize-y"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 6: Language Settings */}
          {activeTab === 'lang' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Select Language')}</label>
                <p className="text-xs text-slate-400 font-light mb-3">{t('Choose default system interface language')}</p>
                <div className="flex items-center gap-6 mt-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="English"
                      checked={language === 'English'}
                      onChange={() => handleLanguageChange('English')}
                      className="w-4 h-4 text-[#8A6F52] focus:ring-[#8A6F52]"
                    />
                    {t('English')}
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="Urdu"
                      checked={language === 'Urdu'}
                      onChange={() => handleLanguageChange('Urdu')}
                      className="w-4 h-4 text-[#8A6F52] focus:ring-[#8A6F52]"
                    />
                    {t('Urdu')}
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-start">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('English Font Preference')}</label>
                  <p className="text-xs text-slate-400 font-light mb-3">{t('Select the font style for English content rendering.')}</p>
                  <select
                    value={englishFont}
                    onChange={(e) => handleEnglishFontChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-[#EAE3CF] dark:border-slate-700 rounded outline-none focus:border-[#8A6F52] text-slate-750 dark:text-slate-300"
                  >
                    <option value="Inter">Inter (Modern Sans-serif)</option>
                    <option value="Roboto">Roboto (Crisp Sans-serif)</option>
                    <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                    <option value="Lora">Lora (Classic Editorial Serif)</option>
                    <option value="Outfit">Outfit (Stylish Rounded Sans)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('Urdu Font Preference')}</label>
                  <p className="text-xs text-slate-400 font-light mb-3">{t('Select the font style for Urdu content rendering.')}</p>
                  <select
                    value={urduFont}
                    onChange={(e) => handleUrduFontChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-[#EAE3CF] dark:border-slate-700 rounded outline-none focus:border-[#8A6F52] text-slate-750 dark:text-slate-300"
                  >
                    <option value="Noto Nastaliq Urdu">Noto Nastaliq Urdu (Traditional Nastaliq)</option>
                    <option value="Noto Sans Arabic">Noto Sans Arabic (Modern Sans-serif)</option>
                    <option value="Jameel Noori Nastaleeq">Jameel Noori Nastaleeq (Standard Pakistani)</option>
                    <option value="Mehr Nastaliq">Mehr Nastaliq (Calligraphic Nastaleeq)</option>
                    <option value="Alvi Nastaleeq">Alvi Nastaleeq (Classic Pakistani)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form Action save control */}
          <div className={`pt-4 border-t border-slate-100 flex items-center ${isUrdu ? 'justify-start' : 'justify-end'}`}>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#2F241C] hover:bg-[#1E1915] text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#8A6F52]" />
              {loading ? t('Saving Settings...') : t('Save Configuration')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
