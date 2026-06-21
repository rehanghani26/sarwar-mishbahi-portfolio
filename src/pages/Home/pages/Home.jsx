import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Book,
  FileText,
  HelpCircle,
  Calendar,
  Play,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
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
import AnimatedFeatureCard from './Animatedfeaturecard ';


// Content for the four small feature cards. Kept as data so the markup
// below stays a clean .map() instead of four near-identical blocks.
const FEATURES = [
  {
    icon: BookOpen,
    title: 'Authentic Knowledge',
    description: 'Quran, Hadith and Fiqh based scholarly content.',
    to: '/articles',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Fatwas',
    description: 'Get authentic Fatwas from qualified Islamic scholars.',
    to: '/fatwas',
  },
  {
    icon: FileText,
    title: 'Research Based Articles',
    description: 'In-depth Islamic articles written with research and evidence.',
    to: '/articles',
  },
  {
    icon: Users,
    title: 'Community Guidance',
    description: 'Guidance and solutions for daily life issues according to Islam.',
    to: '/qa',
  },
];

// Small helper so every section heading animates in the same way on scroll,
// without repeating the motion props everywhere.
function SectionHeading({ eyebrow, title, linkTo, linkLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-end justify-between mb-10 border-b-2 border-[#E5D8CA] pb-4"
    >
      <div className="border-l-4 border-[#B08D57] pl-4">
        <span className="text-xs font-bold text-[#B08D57] uppercase tracking-widest font-serif block mb-1">
          {eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A5F] font-serif leading-none">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-sm font-bold text-[#1F3A5F] hover:text-[#B08D57] flex items-center gap-1 transition-colors">
          {linkLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </motion.div>
  );
}

// Hero placeholder: a bordered blank box reserved for the scholar's own
// portrait photo. No artwork here on purpose — swap the contents for an
// <img> tag once a photo is available.
function ScholarPhotoPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm aspect-[4/5] rounded-2xl border-2 border-dashed border-[#B08D57]/50 bg-[#F5EEE5]/40 flex flex-col items-center justify-center text-center p-6"
    >
      <ImageIcon className="w-10 h-10 text-[#B08D57]/60 mb-3" />
      <p className="text-xs font-bold uppercase tracking-widest text-[#7B654D] font-serif">
        Scholar Photo
      </p>
      <p className="text-[11px] text-[#7B654D]/70 mt-1">
        Reserved space — add portrait here
      </p>
    </motion.div>
  );
}

export default function Home() {
  const dispatch = useDispatch();

  // Redux Selectors
  const { settings } = useSelector((state) => state.settings);
  const { list: articles } = useSelector((state) => state.content.articles);
  const { list: fatwas } = useSelector((state) => state.content.fatwas);
  const { publicList: questions } = useSelector((state) => state.content.questions);
  const { list: publications } = useSelector((state) => state.content.publications);
  const { list: lectures } = useSelector((state) => state.content.lectures);
  const { list: events } = useSelector((state) => state.content.events);

  useEffect(() => {
    dispatch(fetchArticles({ limit: 3 }));
    dispatch(fetchFatwas({ limit: 3 }));
    dispatch(fetchPublicQuestions({ limit: 3 }));
    dispatch(fetchPublications());
    dispatch(fetchLectures());
    dispatch(fetchEvents());
  }, [dispatch]);

  // Fallback defaults
  const heroName = settings?.homepageSettings?.heroName || '';
  const heroTitle = settings?.homepageSettings?.heroTitle || '';
  const heroIntro = settings?.homepageSettings?.heroIntroduction || '';
  const heroMission = settings?.homepageSettings?.heroMission || '';

  const address = settings?.contactInfo?.address || '';
  const phone = settings?.contactInfo?.phone || '';
  const email = settings?.contactInfo?.email || '';

  return (
    <div className="bg-site-bg min-h-screen">

      {/* 1. HERO SECTION — text + Islamic geometric medallion, staggered entrance */}
      <section className="scholar-gradient-bg relative overflow-hidden py-20 border-b-2 border-[#E5D8CA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left: Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 bg-[#F5EEE5] border border-[#E5D8CA] text-[#7B654D] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full font-serif"
            >
              <span className="text-[#B08D57] text-sm">🌙</span> {heroTitle}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F3A5F] leading-tight font-serif tracking-wide"
            >
              {heroName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="text-[#2C2C2C] text-md sm:text-lg font-light leading-relaxed max-w-xl"
            >
              {heroIntro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="border-l-4 border-[#B08D57] pl-4 italic text-sm text-[#7B654D] font-light max-w-lg"
            >
              "{heroMission}"
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                to="/ask"
                className="px-6 py-3 bg-[#1F3A5F] hover:bg-[#162C49] text-white font-bold rounded shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm font-serif"
              >
                <HelpCircle className="w-4.5 h-4.5" />
                Ask a Question
              </Link>
              <Link
                to="/articles"
                className="px-6 py-3 bg-transparent border-2 border-[#E5D8CA] text-[#7B654D] hover:bg-[#FAF7F2] font-bold rounded transition-colors flex items-center gap-2 text-sm"
              >
                <FileText className="w-4.5 h-4.5" />
                Read Articles
              </Link>
              <Link
                to="/fatwas"
                className="px-6 py-3 bg-transparent hover:underline text-[#7B654D] hover:text-[#1F3A5F] font-bold transition-all text-sm flex items-center gap-1.5"
              >
                View Fatwas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Hero Right: blank, bordered space reserved for the scholar's photo */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <ScholarPhotoPlaceholder />
          </div>

        </div>
      </section>

      {/* FEATURE CARDS SECTION — small cards, animated rotating-gradient border */}
      <section className="py-12 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <AnimatedFeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              to={feature.to}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* 2. LATEST ARTICLES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Knowledge Sharing" title="Latest Articles" linkTo="/articles" linkLabel="All Articles" />

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
      <section className="bg-[#FAF7F2] border-y border-[#E5D8CA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Guidance & Rulings" title="Featured Fatwas" linkTo="/fatwas" linkLabel="All Rulings" />

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
        <SectionHeading eyebrow="Interactive Guidance" title="Recent Q&A" linkTo="/qa" linkLabel="All Questions" />

        {questions && questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.slice(0, 3).map((q, i) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="premium-card p-6 flex flex-col justify-between h-full bg-white text-left"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="bg-[#E5D8CA] text-[#7B654D] font-bold px-2.5 py-1 rounded-full text-[10px]">{q.category}</span>
                    <span>{new Date(q.answeredAt || q.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-md font-bold text-slate-900 mb-2 font-serif line-clamp-2">
                    {q.questionTitle}
                  </h4>
                  <p className="text-slate-700 text-xs italic line-clamp-3 mb-4">
                    "{q.detailedQuestion}"
                  </p>
                </div>
                <Link to={`/qa`} className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57] flex items-center gap-1">
                  View Scholar's Answer <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">No answered questions available.</p>
        )}
      </section>

      {/* 5. LATEST PUBLICATIONS & LECTURES (SPLIT SECTION) */}
      <section className="bg-[#FAF7F2] border-t border-[#E5D8CA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Publications */}
          <div>
            <div className="flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 text-left">
              <h2 className="text-xl font-bold text-[#1F3A5F] font-serif flex items-center gap-2">
                <Book className="w-5.5 h-5.5 text-[#B08D57]" />
                Latest Publications
              </h2>
              <Link to="/publications" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57]">
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
            <div className="flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 text-left">
              <h2 className="text-xl font-bold text-[#1F3A5F] font-serif flex items-center gap-2">
                <Play className="w-5.5 h-5.5 text-[#B08D57] fill-current" />
                Latest Lectures
              </h2>
              <Link to="/lectures" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57]">
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
          <div className="flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 text-left">
            <h2 className="text-xl font-bold text-[#1F3A5F] font-serif flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-[#B08D57]" />
              Upcoming Programs & Gatherings
            </h2>
            <Link to="/events" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57]">
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
        <div className="lg:col-span-4 text-left">
          <h2 className="text-xl font-bold text-[#1F3A5F] font-serif mb-8 border-b border-[#E5D8CA] pb-3">
            Contact Details
          </h2>
          <div className="premium-card p-6 space-y-6 bg-white">
            <p className="text-slate-700 text-xs leading-relaxed font-light">
              Feel free to reach out to the office of {heroName} for appointments, invitations, or queries.
            </p>

            <ul className="space-y-4.5 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-tight font-light">{address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4.5 h-4.5 text-[#B08D57] shrink-0" />
                <span className="text-slate-700 font-light">{phone}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4.5 h-4.5 text-[#B08D57] shrink-0" />
                <span className="text-slate-700 font-light">{email}</span>
              </li>
            </ul>

            <Link
              to="/contact"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1F3A5F] hover:bg-[#162C49] text-white text-xs font-bold rounded transition-colors uppercase tracking-wider font-serif"
            >
              Send Message
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}