import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Book, Award, FileText, HelpCircle, Calendar, Play, Download, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { fetchArticles } from '../../../store/slices/contentSlice';
import { fetchFatwas } from '../../../store/slices/contentSlice';
import { fetchPublicQuestions } from '../../../store/slices/contentSlice';
import { fetchPublications } from '../../../store/slices/contentSlice';
import { fetchLectures } from '../../../store/slices/contentSlice';
import { fetchEvents } from '../../../store/slices/contentSlice';
import { fetchSettings } from '../../../store/slices/settingsSlice';

import ArticleCard from '../../../components/ArticleCard';
import FatwaCard from '../../../components/FatwaCard';
import LectureCard from '../../../components/LectureCard';
import PublicationCard from '../../../components/PublicationCard';
import EventCard from '../../../components/EventCard';

export default function Home() {
  const dispatch = useDispatch();

  // Redux Selectors
  const { settings, loading: settingsLoading } = useSelector((state) => state.settings);
  const { list: articles } = useSelector((state) => state.content.articles);
  const { list: fatwas } = useSelector((state) => state.content.fatwas);
  const { publicList: questions } = useSelector((state) => state.content.questions);
  const { list: publications } = useSelector((state) => state.content.publications);
  const { list: lectures } = useSelector((state) => state.content.lectures);
  const { list: events } = useSelector((state) => state.content.events);

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchArticles({ limit: 3 }));
    dispatch(fetchFatwas({ limit: 3 }));
    dispatch(fetchPublicQuestions({ limit: 3 }));
    dispatch(fetchPublications());
    dispatch(fetchLectures());
    dispatch(fetchEvents());
  }, [dispatch]);

  // Loading indicator for initial settings fetch
  if (settingsLoading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-site-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-dark dark:border-brown-mid"></div>
      </div>
    );
  }

  // Fallback defaults
  const heroName = settings?.homepageSettings?.heroName || 'Dr. Islamic Scholar';
  const heroTitle = settings?.homepageSettings?.heroTitle || 'Sheikh & Educator';
  const heroIntro = settings?.homepageSettings?.heroIntroduction || 'Welcome to the official portal.';
  const heroMission = settings?.homepageSettings?.heroMission || 'Spreading verified teachings.';

  const address = settings?.contactInfo?.address || '100 Minaret Road';
  const phone = settings?.contactInfo?.phone || '+1 (555) 123-4567';
  const email = settings?.contactInfo?.email || 'scholar@example.com';

  return (
    <div className="bg-site-bg min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="scholar-gradient-bg text-white islamic-pattern relative overflow-hidden py-20 lg:py-28 border-b border-[#8A6F52]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left: Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block bg-[#8A6F52]/25 text-[#8A6F52] border border-[#8A6F52]/45 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full font-serif">
              {heroTitle}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif tracking-wide">
              {heroName}
            </h1>
            <p className="text-slate-200 text-md sm:text-lg font-light leading-relaxed max-w-xl">
              {heroIntro}
            </p>
            <div className="border-l-4 border-[#8A6F52] pl-4 italic text-sm text-slate-350 font-light max-w-lg">
              "{heroMission}"
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/ask"
                className="px-6 py-3 bg-[#8A6F52] hover:bg-[#2F241C] text-white font-bold rounded shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm font-serif"
              >
                <HelpCircle className="w-4.5 h-4.5" />
                Ask a Question
              </Link>
              <Link
                to="/articles"
                className="px-6 py-3 bg-transparent border-2 border-white hover:border-[#8A6F52] hover:text-[#8A6F52] text-white font-bold rounded transition-colors flex items-center gap-2 text-sm"
              >
                <FileText className="w-4.5 h-4.5" />
                Read Articles
              </Link>
              <Link
                to="/fatwas"
                className="px-6 py-3 bg-transparent hover:underline text-[#8A6F52] font-bold transition-all text-sm flex items-center gap-1.5"
              >
                View Fatwas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero Right: Aesthetic Frame / Calligraphy placeholder */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#8A6F52]/40 flex items-center justify-center p-3.5 bg-[#1E1915]/45 shadow-2xl">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#8A6F52]/20 animate-spin" style={{ animationDuration: '60s' }}></div>
              <div className="w-full h-full rounded-full bg-[#1E1915] flex flex-col items-center justify-center text-center p-6 border border-[#8A6F52]/35">
                <BookOpen className="w-16 h-16 text-[#8A6F52] mb-4" />
                <span className="block text-xl font-bold font-serif text-white tracking-widest leading-none">VERIFIED</span>
                <span className="block text-xs font-semibold text-[#8A6F52] uppercase tracking-wider mt-1.5 font-serif">Islamic Scholarship</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LATEST ARTICLES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-[#EAE3CF]/50 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">Knowledge Sharing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif">Latest Articles</h2>
          </div>
          <Link to="/articles" className="text-sm font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400 flex items-center gap-1">
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">No articles available.</p>
        )}
      </section>

      {/* 3. FEATURED FATWAS */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-site-border/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 border-b border-[#EAE3CF]/50 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">Guidance & Rulings</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif">Featured Fatwas</h2>
            </div>
            <Link to="/fatwas" className="text-sm font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400 flex items-center gap-1">
              All Rulings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {fatwas && fatwas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fatwas.slice(0, 3).map((fatwa) => (
                <FatwaCard key={fatwa._id} fatwa={fatwa} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-6">No fatwas available.</p>
          )}
        </div>
      </section>

      {/* 4. RECENT Q&A */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-[#EAE3CF]/50 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">Interactive Guidance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif">Recent Q&A</h2>
          </div>
          <Link to="/qa" className="text-sm font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400 flex items-center gap-1">
            All Questions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {questions && questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.slice(0, 3).map((q) => (
              <div key={q._id} className="premium-card p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="bg-[#2F241C]/10 dark:bg-amber-950/30 text-[#2F241C] dark:text-[#8A6F52] font-bold px-2 py-0.5 rounded">{q.category}</span>
                    <span>{new Date(q.answeredAt || q.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-md font-bold text-slate-900 dark:text-white mb-2 font-serif line-clamp-2">
                    {q.questionTitle}
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 text-xs italic line-clamp-3 mb-4">
                    "{q.detailedQuestion}"
                  </p>
                </div>
                <Link to={`/qa`} className="text-xs font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400 flex items-center gap-1">
                  View Scholar's Answer <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">No answered questions available.</p>
        )}
      </section>

      {/* 5. LATEST PUBLICATIONS & LECTURES (SPLIT SECTION) */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-t border-[#EAE3CF]/40 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Publications */}
          <div>
            <div className="flex items-end justify-between mb-8 border-b border-[#EAE3CF]/50 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-[#2F241C] dark:text-[#8A6F52] font-serif flex items-center gap-2">
                <Book className="w-5.5 h-5.5 text-[#8A6F52] dark:text-amber-500" />
                Latest Publications
              </h2>
              <Link to="/publications" className="text-xs font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400">
                View All
              </Link>
            </div>

            {publications && publications.length > 0 ? (
              <div className="space-y-4">
                {publications.slice(0, 2).map((pub) => (
                  <PublicationCard key={pub._id} publication={pub} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-6">No publications available.</p>
            )}
          </div>

          {/* Right: Lectures */}
          <div>
            <div className="flex items-end justify-between mb-8 border-b border-[#EAE3CF]/50 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-[#2F241C] dark:text-[#8A6F52] font-serif flex items-center gap-2">
                <Play className="w-5.5 h-5.5 text-[#8A6F52] dark:text-amber-500 fill-current" />
                Latest Lectures
              </h2>
              <Link to="/lectures" className="text-xs font-bold text-[#2F241C] dark:text-[#8A6F52] hover:text-[#8A6F52] dark:hover:text-amber-400">
                View All
              </Link>
            </div>

            {lectures && lectures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lectures.slice(0, 2).map((lecture) => (
                  <LectureCard key={lecture._id} lecture={lecture} onPlay={() => window.open(lecture.videoUrl, '_blank')} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-6">No lectures available.</p>
            )}
          </div>

        </div>
      </section>

      {/* 6. EVENTS & CONTACT INFO (SPLIT) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Upcoming Programs (8 columns on large screen) */}
        <div className="lg:col-span-8">
          <div className="flex items-end justify-between mb-8 border-b border-[#EAE3CF]/50 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-[#2F241C] dark:text-[#8A6F52] font-serif flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-[#8A6F52] dark:text-amber-500" />
              Upcoming Programs & Gatherings
            </h2>
            <Link to="/events" className="text-xs font-bold text-[#2F241C] dark:text-[#2F241C] hover:text-[#8A6F52] dark:hover:text-amber-400">
              View All
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 2).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-6">No scheduled events.</p>
          )}
        </div>

        {/* Contact info card (4 columns on large screen) */}
        <div className="lg:col-span-4">
          <h2 className="text-xl font-bold text-[#2F241C] dark:text-[#8A6F52] font-serif mb-8 border-b border-[#EAE3CF]/50 dark:border-slate-800 pb-3">
            Contact Details
          </h2>
          <div className="premium-card p-6 space-y-6">
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-light">
              Feel free to reach out to the office of {heroName} for appointments, invitations, or queries.
            </p>
            
            <ul className="space-y-4.5 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#8A6F52] dark:text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 leading-tight font-light">{address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4.5 h-4.5 text-[#8A6F52] dark:text-amber-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-light">{phone}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4.5 h-4.5 text-[#8A6F52] dark:text-amber-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-light">{email}</span>
              </li>
            </ul>

            <Link
              to="/contact"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#2F241C] hover:bg-[#1E1915] text-white text-xs font-bold rounded transition-colors uppercase tracking-wider font-serif"
            >
              Send Message
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
