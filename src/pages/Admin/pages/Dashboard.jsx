import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  Award,
  Play,
  HelpCircle,
  Users,
  Settings,
  Mail,
  Shield,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { getStats } from '../../../services/about';
import { useSettings } from '../../../context/SettingsContext';

export default function Dashboard() {
  const { settings } = useSettings();
  const { loggedInUser } = useSelector((state) => state.auth);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (statsLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-[#FAF7F2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A5F]"></div>
      </div>
    );
  }

  // Statistics fallbacks
  const tArticles = stats?.totalArticles || 0;
  const tFatwas = stats?.totalFatwas || 0;
  const tPublications = stats?.totalPublications || 0;
  const tLectures = stats?.totalLectures || 0;
  const tQuestions = stats?.totalQuestions || 0;
  const pQuestions = stats?.pendingQuestions || 0;
  const tMessages = stats?.totalMessages || 0;
  const eVisitors = stats?.estimatedVisitors || 0;

  const statCards = [
    { label: language === 'en' ? 'Total Articles' : 'کل مقالات', count: tArticles, icon: <FileText className="w-5 h-5 text-[#B08D57]" />, color: 'bg-amber-50/50 border-amber-100', link: '/admin/articles' },
    { label: language === 'en' ? 'Total Fatwas' : 'کل فتاویٰ', count: tFatwas, icon: <Bookmark className="w-5 h-5 text-[#B08D57]" />, color: 'bg-yellow-50 border-yellow-100', link: '/admin/fatwas' },
    { label: language === 'en' ? 'Total Publications' : 'کل مطبوعات', count: tPublications, icon: <Award className="w-5 h-5 text-[#B08D57]" />, color: 'bg-blue-50 border-blue-100', link: '/admin/publications' },
    { label: language === 'en' ? 'Total Lectures' : 'کل بیانات', count: tLectures, icon: <Play className="w-5 h-5 text-[#B08D57]" />, color: 'bg-rose-50 border-rose-100', link: '/admin/lectures' },
    { label: language === 'en' ? 'Total Q&As' : 'کل سوال و جواب', countSub: `${pQuestions} ${language === 'en' ? 'Pending' : 'زیرِ التوا'}`, icon: <HelpCircle className="w-5 h-5 text-[#B08D57]" />, color: 'bg-purple-50 border-purple-100', link: '/admin/questions' },
    { label: language === 'en' ? 'Total Messages' : 'کل پیغامات', count: tMessages, icon: <Mail className="w-5 h-5 text-[#B08D57]" />, color: 'bg-slate-50 border-slate-100', link: '/admin/dashboard' },
    { label: language === 'en' ? 'Total Visitors' : 'کل ویب سائٹ زائرین', count: eVisitors, icon: <Users className="w-5 h-5 text-[#B08D57]" />, color: 'bg-[#1F3A5F]/10 border-[#B08D57]/20', link: '/' },
  ];

  return (
    <div className={`bg-[#FAF7F2] py-4 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 space-y-4 animate-fade-in ${language === 'ur' ? 'text-right' : 'text-left'}`}>
        
        {/* Dashboard Header banner */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5D8CA]/50 pb-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#1F3A5F] flex items-center justify-center text-[#B08D57] shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div className={language === 'ur' ? 'text-right' : 'text-left'}>
              <h1 className="text-lg font-bold text-[#1F3A5F] font-serif">{language === 'en' ? 'Admin Dashboard' : 'انتظامی ڈیش بورڈ'}</h1>
              <p className="text-xs text-slate-400 font-light">{language === 'en' ? `Welcome, ${loggedInUser?.username || 'Administrator'}` : `خوش آمدید، ${loggedInUser?.username || 'ایڈمنسٹریٹر'}`}</p>
            </div>
          </div>

          {/* Quick link button to global settings */}
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 h-8 px-4 border border-[#E5D8CA] bg-white rounded text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs uppercase tracking-wider font-serif"
          >
            <Settings className="w-5 h-5" />
            {language === 'en' ? 'Website Settings' : 'ویب سائٹ کی ترتیبات'}
          </Link>
        </div>

        {/* Statistics Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          {statCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className={`p-4 bg-white border border-[#E5D8CA] rounded-lg shadow-sm hover:shadow transition-all group flex flex-col justify-between ${language === 'ur' ? 'text-right' : 'text-left'}`}
            >
              <div className={`flex items-center justify-between mb-4 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`p-4 rounded ${card.color} shrink-0`}>
                  {card.icon}
                </div>
                {card.countSub ? (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">
                    {card.countSub}
                  </span>
                ) : (
                  <ArrowLeft className={`w-5 h-5 text-slate-300 group-hover:text-[#B08D57] transition-all ${language === 'ur' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1 rotate-180'}`} />
                )}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <span className="block text-lg font-extrabold text-[#1F3A5F] font-serif mt-1">{card.count}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions tiles grid */}
        <div className="bg-white border border-[#E5D8CA] rounded-lg p-4 shadow-sm">
          <h2 className={`text-base font-bold text-slate-800 font-serif mb-4 pb-2 border-b border-slate-100 uppercase tracking-wide ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            {language === 'en' ? 'Quick Content Operations' : 'مواد کے فوری آپریشنز'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Create Article */}
            <Link
              to="/admin/articles"
              className={`flex items-center gap-4 p-4 border border-[#E5D8CA] rounded hover:border-[#B08D57] transition-all bg-[#1F3A5F]/5 text-[#1F3A5F] group ${language === 'ur' ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{language === 'en' ? 'Write New Article' : 'نیا مضمون لکھیں'}</span>
                <span className="block text-xs text-[#B08D57] font-semibold">{language === 'en' ? 'Publish Islamic rulings' : 'اسلامی احکام شائع کریں'}</span>
              </div>
            </Link>

            {/* Create Fatwa */}
            <Link
              to="/admin/fatwas"
              className={`flex items-center gap-4 p-4 border border-[#E5D8CA] rounded hover:border-[#B08D57] transition-all bg-yellow-500/5 text-amber-800 group ${language === 'ur' ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}
            >
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{language === 'en' ? 'Add New Fatwa' : 'نیا فتویٰ شامل کریں'}</span>
                <span className="block text-xs text-[#B08D57] font-semibold">{language === 'en' ? 'Solutions to jurisprudential issues' : 'فقہی مسائل کے حل'}</span>
              </div>
            </Link>

            {/* Answer Questions */}
            <Link
              to="/admin/questions"
              className={`flex items-center gap-4 p-4 border border-[#E5D8CA] rounded hover:border-[#B08D57] transition-all bg-purple-500/5 text-purple-900 group ${language === 'ur' ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}
            >
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{language === 'en' ? 'Review Questions' : 'سوالات کا جائزہ لیں'}</span>
                <span className="block text-xs text-[#B08D57] font-semibold">
                  {language === 'en' ? `${pQuestions} pending in inbox` : `${pQuestions} ان باکس میں زیرِ التوا`}
                </span>
              </div>
            </Link>

            {/* Upload Publication */}
            <Link
              to="/admin/publications"
              className={`flex items-center gap-4 p-4 border border-[#E5D8CA] rounded hover:border-[#B08D57] transition-all bg-blue-500/5 text-blue-900 group ${language === 'ur' ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{language === 'en' ? 'Add Publication' : 'مطبوعہ شامل کریں'}</span>
                <span className="block text-xs text-[#B08D57] font-semibold">{language === 'en' ? 'Link Google Drive Files' : 'گوگل ڈرائیو فائلز لنک کریں'}</span>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
