import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Plus
} from 'lucide-react';
import { fetchStats } from '../../../store/slices/settingsSlice';
import useTranslate from '../../../hooks/useTranslate';

export default function Dashboard() {
  const { stats, statsLoading, error } = useSelector((state) => state.settings);
  const { adminInfo } = useSelector((state) => state.auth);
  const { t, isUrdu } = useTranslate();

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    { label: t('Total Articles'), count: tArticles, icon: <FileText className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-amber-50/50 border-amber-100', link: '/admin/articles' },
    { label: t('Total Fatwas'), count: tFatwas, icon: <Bookmark className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-yellow-50 border-yellow-100', link: '/admin/fatwas' },
    { label: t('Total Publications'), count: tPublications, icon: <Award className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-blue-50 border-blue-100', link: '/admin/publications' },
    { label: t('Total Lectures'), count: tLectures, icon: <Play className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-rose-50 border-rose-100', link: '/admin/lectures' },
    { label: t('Total Q&As'), count: tQuestions, countSub: `${pQuestions} ${t('Pending')}`, icon: <HelpCircle className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-purple-50 border-purple-100', link: '/admin/questions' },
    { label: t('Total Messages'), count: tMessages, icon: <Mail className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-slate-50 border-slate-100', link: '/admin/dashboard' },
    { label: t('Total Website Visitors'), count: eVisitors, icon: <Users className="w-5 h-5 text-[#8A6F52]" />, color: 'bg-[#8A6F52]/10 border-[#8A6F52]/20', link: '/' },
  ];

  return (
    <div className="bg-[#FAF9F5] py-4 min-h-[80vh]" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 space-y-4 animate-fade-in">
        
        {/* Dashboard Header banner */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3CF]/50 pb-4 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#2F241C] flex items-center justify-center text-[#8A6F52] shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2F241C] font-serif">{t('Admin Dashboard')}</h1>
              <p className="text-xs text-slate-400 font-light">{t('Welcome back,')} {adminInfo?.username || 'Administrator'}</p>
            </div>
          </div>

          {/* Quick link button to global settings */}
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 h-8 px-4 border border-[#EAE3CF] bg-white rounded text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs uppercase tracking-wider font-serif"
          >
            <Settings className="w-5 h-5" />
            {t('Website Settings')}
          </Link>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className={`p-4 bg-white border border-[#EAE3CF] rounded-lg shadow-sm hover:shadow transition-all group flex flex-col justify-between ${isUrdu ? 'text-right' : 'text-left'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded ${card.color} shrink-0`}>
                  {card.icon}
                </div>
                {card.countSub ? (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">
                    {card.countSub}
                  </span>
                ) : (
                  <ArrowRight className={`w-5 h-5 text-slate-300 group-hover:text-[#8A6F52] transition-all ${isUrdu ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                )}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <span className="block text-lg font-extrabold text-[#2F241C] font-serif mt-1">{card.count}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions tiles grid */}
        <div className={`bg-white border border-[#EAE3CF] rounded-lg p-4 shadow-sm ${isUrdu ? 'text-right' : 'text-left'}`}>
          <h2 className="text-base font-bold text-slate-800 font-serif mb-4 pb-2 border-b border-slate-100 uppercase tracking-wide">
            {t('Quick Content Operations')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Create Article */}
            <Link
              to="/admin/articles"
              className={`flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-[#2F241C]/5 text-[#2F241C] group ${isUrdu ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#2F241C] text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{t('Write New Article')}</span>
                <span className="block text-xs text-[#8A6F52] font-semibold">{t('Publish Islamic Rulings')}</span>
              </div>
            </Link>

            {/* Create Fatwa */}
            <Link
              to="/admin/fatwas"
              className={`flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-yellow-500/5 text-amber-800 group ${isUrdu ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{t('Add New Fatwa')}</span>
                <span className="block text-xs text-[#8A6F52] font-semibold">{t('Jurisprudence Solutions')}</span>
              </div>
            </Link>

            {/* Answer Questions */}
            <Link
              to="/admin/questions"
              className={`flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-purple-500/5 text-purple-900 group ${isUrdu ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{t('Review Questions')}</span>
                <span className="block text-xs text-[#8A6F52] font-semibold">{pQuestions} {t('Pending Inbox')}</span>
              </div>
            </Link>

            {/* Upload Publication */}
            <Link
              to="/admin/publications"
              className={`flex items-center gap-4 p-4 border border-[#EAE3CF] rounded hover:border-[#8A6F52] transition-all bg-blue-500/5 text-blue-900 group ${isUrdu ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold">{t('Add Publication')}</span>
                <span className="block text-xs text-[#8A6F52] font-semibold">{t('Link Google Drive Files')}</span>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
