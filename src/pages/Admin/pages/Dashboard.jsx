import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchStats } from '../../../store/slices/settingsSlice';

export default function Dashboard() {
  const { stats, statsLoading } = useSelector((state) => state.settings);
  const { adminInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (statsLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-[#FAF9F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
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
    { label: 'کل مقالات', count: tArticles, icon: <FileText className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-amber-50/50 border-amber-100', link: '/admin/articles' },
    { label: 'کل فتاویٰ', count: tFatwas, icon: <Bookmark className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-yellow-50 border-yellow-100', link: '/admin/fatwas' },
    { label: 'کل مطبوعات', count: tPublications, icon: <Award className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-blue-50 border-blue-100', link: '/admin/publications' },
    { label: 'کل بیانات', count: tLectures, icon: <Play className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-rose-50 border-rose-100', link: '/admin/lectures' },
    { label: 'کل سوال و جواب', count: tQuestions, countSub: `${pQuestions} زیرِ التوا`, icon: <HelpCircle className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-purple-50 border-purple-100', link: '/admin/questions' },
    { label: 'کل پیغامات', count: tMessages, icon: <Mail className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-slate-50 border-slate-100', link: '/admin/dashboard' },
    { label: 'کل ویب سائٹ زائرین', count: eVisitors, icon: <Users className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-[#8A6F52]/10 border-[#8A6F52]/20', link: '/' },
  ];

  return (
    <div className="bg-[#FAF9F5] py-4 min-h-[80vh] text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 space-y-4 animate-fade-in text-right">
        
        {/* Dashboard Header banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3CF]/50 pb-4 text-right">
          <div className="flex items-center gap-4 text-right">
            <div className="w-10 h-10 rounded bg-[#2F241C] flex items-center justify-center text-[#8A6F52] shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h1 className="text-lg font-bold text-[#2F241C] font-serif text-right">انتظامی ڈیش بورڈ</h1>
              <p className="text-xs text-slate-400 font-light text-right">خوش آمدید، {adminInfo?.username || 'ایڈمنسٹریٹر'}</p>
            </div>
          </div>

          {/* Quick link button to global settings */}
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 h-8 px-4 border border-[#EAE3CF] bg-white rounded text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs uppercase tracking-wider font-serif"
          >
            <Settings className="w-5 h-5" />
            ویب سائٹ کی ترتیبات
          </Link>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
          {statCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="p-4 bg-white border border-[#EAE3CF] rounded-lg shadow-sm hover:shadow transition-all group flex flex-col justify-between text-right"
            >
              <div className="flex items-center justify-between mb-4 text-right">
                <div className={`p-4 rounded ${card.color} shrink-0`}>
                  {card.icon}
                </div>
                {card.countSub ? (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">
                    {card.countSub}
                  </span>
                ) : (
                  <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-[#8A6F52] transition-all group-hover:-translate-x-1" />
                )}
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-right">{card.label}</span>
                <span className="block text-lg font-extrabold text-[#2F241C] font-serif mt-1 text-right">{card.count}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions tiles grid */}
        <div className="bg-white border border-[#EAE3CF] rounded-lg p-4 shadow-sm text-right">
          <h2 className="text-base font-bold text-slate-800 font-serif mb-4 pb-2 border-b border-slate-100 uppercase tracking-wide text-right">
            مواد کے فوری آپریشنز
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
            
            {/* Create Article */}
            <Link
              to="/admin/articles"
              className="flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-[#2F241C]/5 text-[#2F241C] group text-right flex-row-reverse"
            >
              <div className="w-8 h-8 rounded-full bg-[#2F241C] text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-right">نیا مضمون لکھیں</span>
                <span className="block text-xs text-[#8A6F52] font-semibold text-right">اسلامی احکام شائع کریں</span>
              </div>
            </Link>

            {/* Create Fatwa */}
            <Link
              to="/admin/fatwas"
              className="flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-yellow-500/5 text-amber-800 group text-right flex-row-reverse"
            >
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-right">نیا فتویٰ شامل کریں</span>
                <span className="block text-xs text-[#8A6F52] font-semibold text-right">فقہی مسائل کے حل</span>
              </div>
            </Link>

            {/* Answer Questions */}
            <Link
              to="/admin/questions"
              className="flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-purple-500/5 text-purple-900 group text-right flex-row-reverse"
            >
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-right">سوالات کا جائزہ لیں</span>
                <span className="block text-xs text-[#8A6F52] font-semibold text-right">{pQuestions} ان باکس میں زیرِ التوا</span>
              </div>
            </Link>

            {/* Upload Publication */}
            <Link
              to="/admin/publications"
              className="flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-blue-500/5 text-blue-900 group text-right flex-row-reverse"
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-right">مطبوعہ شامل کریں</span>
                <span className="block text-xs text-[#8A6F52] font-semibold text-right">گوگل ڈرائیو فائلز لنک کریں</span>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
