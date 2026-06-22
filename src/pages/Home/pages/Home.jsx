import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Book,
  FileText,
  HelpCircle,
  Calendar,
  Play,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { getArticles } from '../../../services/article';
import { getFatwas } from '../../../services/fatwa';
import { getPublicQuestions } from '../../../services/question';
import { getPublications, getLectures } from '../../../services/publication';
import { getEvents } from '../../../services/event';
import { useSettings } from '../../../context/SettingsContext';

import ArticleCard from '../../../components/ArticleCard';
import FatwaCard from '../../../components/FatwaCard';
import LectureCard from '../../../components/LectureCard';
import PublicationCard from '../../../components/PublicationCard';
import EventCard from '../../../components/EventCard';
import AnimatedFeatureCard from './Animatedfeaturecard ';

// Small helper so every section heading animates in the same way on scroll,
// without repeating the motion props everywhere.
function SectionHeading({ eyebrow, title, linkTo, linkLabel }) {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-end justify-between mb-10 border-b-2 border-[#E5D8CA] pb-4"
    >
      <div className={`border-[#B08D57] ${language === 'ur' ? 'border-r-4 pr-4 text-right' : 'border-l-4 pl-4 text-left'}`}>
        <span className="text-xs font-bold text-[#B08D57] uppercase tracking-widest block mb-1">
          {eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A5F] leading-none">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-sm font-bold text-[#1F3A5F] hover:text-[#B08D57] flex items-center gap-1 transition-colors">
          {linkLabel} {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Link>
      )}
    </motion.div>
  );
}

// Hero placeholder: a bordered blank box reserved for the scholar's own
// portrait photo. No artwork here on purpose — swap the contents for an
// <img> tag once a photo is available.
function ScholarPhotoPlaceholder() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm aspect-[4/5] rounded-2xl border-2 border-dashed border-[#B08D57]/50 bg-[#F5EEE5]/40 flex flex-col items-center justify-center text-center p-6"
    >
      <ImageIcon className="w-10 h-10 text-[#B08D57]/60 mb-3" />
      <p className="text-xs font-bold uppercase tracking-widest text-[#7B654D]">
        {language === 'en' ? 'Scholar Photograph' : 'عالم صاحب کی تصویر'}
      </p>
      <p className="text-[11px] text-[#7B654D]/70 mt-1">
        {language === 'en' ? 'Reserved Space — Place Image Here' : 'مخصوص جگہ — یہاں تصویر لگائیں'}
      </p>
    </motion.div>
  );
}

export default function Home() {
  const { settings } = useSettings();
  const [articles, setArticles] = useState([]);
  const [fatwas, setFatwas] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [publications, setPublications] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [events, setEvents] = useState([]);

  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [articlesData, fatwasData, questionsData, publicationsData, lecturesData, eventsData] = await Promise.all([
          getArticles({ limit: 3 }),
          getFatwas({ limit: 3 }),
          getPublicQuestions({ limit: 3 }),
          getPublications(),
          getLectures(),
          getEvents()
        ]);
        setArticles(articlesData.articles || []);
        setFatwas(fatwasData.fatwas || []);
        setQuestions(questionsData.questions || []);
        setPublications(publicationsData || []);
        setLectures(lecturesData || []);
        setEvents(eventsData || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      }
    };
    loadHomeData();
  }, []);

  // Fallback defaults
  const heroName = settings?.homepageSettings?.heroName || '';
  const heroTitle = settings?.homepageSettings?.heroTitle || '';
  const heroIntro = settings?.homepageSettings?.heroIntroduction || '';
  const heroMission = settings?.homepageSettings?.heroMission || '';

  const address = settings?.contactInfo?.address || '';
  const phone = settings?.contactInfo?.phone || '';
  const email = settings?.contactInfo?.email || '';

  const FEATURES = [
    {
      icon: BookOpen,
      title: language === 'en' ? 'Authentic Knowledge' : 'مستند علم',
      description: language === 'en' ? 'Islamic content based on Quran, Hadith, and Fiqh.' : 'قرآن، حدیث اور فقہ پر مبنی علمی مواد۔',
      to: '/articles',
    },
    {
      icon: ShieldCheck,
      title: language === 'en' ? 'Verified Fatwas' : 'تصدیق شدہ فتاویٰ',
      description: language === 'en' ? 'Get verified rulings from trusted scholars.' : 'مستند علما سے تصدیق شدہ فتاویٰ حاصل کریں۔',
      to: '/fatwas',
    },
    {
      icon: FileText,
      title: language === 'en' ? 'Scholarly Articles' : 'تحقیقی مقالات',
      description: language === 'en' ? 'Detailed Islamic research papers written with evidence.' : 'تحقیق اور دلائل کے ساتھ لکھے گئے تفصیلی اسلامی مقالات۔',
      to: '/articles',
    },
    {
      icon: Users,
      title: language === 'en' ? 'Social Guidance' : 'معاشرتی رہنمائی',
      description: language === 'en' ? 'Shariah-compliant guidance and solutions for daily issues.' : 'روزمرہ کے مسائل کے بارے میں شریعت کے مطابق رہنمائی اور حل۔',
      to: '/qa',
    },
  ];

  return (
    <div className="bg-site-bg min-h-screen">

      {/* 1. HERO SECTION — text + Islamic geometric medallion, staggered entrance */}
      <section className="scholar-gradient-bg relative overflow-hidden py-20 border-b-2 border-[#E5D8CA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left: Text Content */}
          <div className={`lg:col-span-7 space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 bg-[#F5EEE5] border border-[#E5D8CA] text-[#7B654D] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
            >
              <span className="text-[#B08D57] text-sm"></span> {heroTitle}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F3A5F] leading-tight tracking-wide"
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
              className={`border-[#B08D57] ${language === 'ur' ? 'border-r-4 pr-4 text-right' : 'border-l-4 pl-4 text-left'} italic text-sm text-[#7B654D] font-light max-w-lg`}
            >
              "{heroMission}"
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
              className="flex flex-wrap items-center gap-4 pt-4 justify-start"
            >
              <Link
                to="/ask"
                className="px-6 py-3 bg-[#1F3A5F] hover:bg-[#162C49] text-white font-bold rounded shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm font-serif"
              >
                <HelpCircle className="w-4.5 h-4.5" />
                {language === 'en' ? 'Ask Question' : 'سوال پوچھیں'}
              </Link>
              <Link
                to="/articles"
                className="px-6 py-3 bg-transparent border-2 border-[#E5D8CA] text-[#7B654D] hover:bg-[#FAF7F2] font-bold rounded transition-colors flex items-center gap-2 text-sm"
              >
                <FileText className="w-4.5 h-4.5" />
                {language === 'en' ? 'Read Articles' : 'مقالات پڑھیں'}
              </Link>
              <Link
                to="/fatwas"
                className="px-6 py-3 bg-transparent hover:underline text-[#7B654D] hover:text-[#1F3A5F] font-bold transition-all text-sm flex items-center gap-1.5"
              >
                {language === 'en' ? 'View Fatwas' : 'فتاویٰ دیکھیں'}
                {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
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
        <SectionHeading 
          eyebrow={language === 'en' ? 'PROMOTING KNOWLEDGE' : 'علم کا فروغ'} 
          title={language === 'en' ? 'Latest Articles' : 'تازہ ترین مقالات'} 
          linkTo="/articles" 
          linkLabel={language === 'en' ? 'All Articles' : 'تمام مقالات'} 
        />

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">
            {language === 'en' ? 'No articles available.' : 'کوئی مضمون دستیاب نہیں ہے۔'}
          </p>
        )}
      </section>

      {/* 3. FEATURED FATWAS */}
      <section className="bg-[#FAF7F2] border-y border-[#E5D8CA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            eyebrow={language === 'en' ? 'GUIDANCE & RULINGS' : 'رہنمائی اور احکام'} 
            title={language === 'en' ? 'Featured Fatwas' : 'منتخب فتاویٰ'} 
            linkTo="/fatwas" 
            linkLabel={language === 'en' ? 'All Rulings' : 'تمام احکام'} 
          />

          {fatwas && fatwas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fatwas.slice(0, 3).map((fatwa) => (
                <FatwaCard key={fatwa._id} fatwa={fatwa} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-6">
              {language === 'en' ? 'No fatwas available.' : 'کوئی فتویٰ دستیاب نہیں ہے۔'}
            </p>
          )}
        </div>
      </section>

      {/* 4. RECENT Q&A */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          eyebrow={language === 'en' ? 'MUTUAL GUIDANCE' : 'باہمی رہنمائی'} 
          title={language === 'en' ? 'Recent Q&A' : 'حالیہ سوال و جواب'} 
          linkTo="/qa" 
          linkLabel={language === 'en' ? 'All Questions' : 'تمام سوالات'} 
        />

        {questions && questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.slice(0, 3).map((q, i) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`premium-card p-6 flex flex-col justify-between h-full bg-white ${language === 'ur' ? 'text-right' : 'text-left'}`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="bg-[#E5D8CA] text-[#7B654D] font-bold px-2.5 py-1 rounded-full text-[10px]">{q.category}</span>
                    <span>{new Date(q.answeredAt || q.updatedAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}</span>
                  </div>
                  <h4 className="text-md font-bold text-slate-900 mb-2 line-clamp-2">
                    {q.questionTitle}
                  </h4>
                  <p className="text-slate-700 text-xs italic line-clamp-3 mb-4">
                    "{q.detailedQuestion}"
                  </p>
                </div>
                <Link to={`/qa`} className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57] flex items-center gap-1">
                  {language === 'en' ? 'View Answer' : 'مفتی صاحب کا جواب دیکھیں'} 
                  {language === 'en' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">
            {language === 'en' ? 'No answered questions available.' : 'کوئی جواب شدہ سوال دستیاب نہیں ہے۔'}
          </p>
        )}
      </section>

      {/* 5. LATEST PUBLICATIONS & LECTURES (SPLIT SECTION) */}
      <section className="bg-[#FAF7F2] border-t border-[#E5D8CA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12" dir={language === 'ur' ? 'rtl' : 'ltr'}>

          {/* Left: Publications */}
          <div className={language === 'ur' ? 'text-right' : 'text-left'}>
            <div className={`flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
              <h2 className="text-xl font-bold text-[#1F3A5F] flex items-center gap-2">
                <Book className="w-5.5 h-5.5 text-[#B08D57]" />
                {language === 'en' ? 'Latest Publications' : 'تازہ ترین مطبوعات'}
              </h2>
              <Link to="/publications" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57]">
                {language === 'en' ? 'View All' : 'سب دیکھیں'}
              </Link>
            </div>

            {publications && publications.length > 0 ? (
              <div className="space-y-4">
                {publications.slice(0, 2).map((pub) => (
                  <PublicationCard key={pub._id} publication={pub} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-6">
                {language === 'en' ? 'No publications available.' : 'کوئی مطبوعہ دستیاب نہیں ہے۔'}
              </p>
            )}
          </div>

          {/* Right: Lectures */}
          <div className={language === 'ur' ? 'text-right' : 'text-left'}>
            <div className={`flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
              <h2 className="text-xl font-bold text-[#1F3A5F] flex items-center gap-2">
                <Play className="w-5.5 h-5.5 text-[#B08D57] fill-current" />
                {language === 'en' ? 'Latest Lectures' : 'تازہ ترین بیانات'}
              </h2>
              <Link to="/lectures" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57]">
                {language === 'en' ? 'View All' : 'سب دیکھیں'}
              </Link>
            </div>

            {lectures && lectures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lectures.slice(0, 2).map((lecture) => (
                  <LectureCard key={lecture._id} lecture={lecture} onPlay={() => window.open(lecture.videoUrl, '_blank')} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-6">
                {language === 'en' ? 'No bayans available.' : 'کوئی بیان دستیاب نہیں ہے۔'}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* 6. EVENTS & CONTACT INFO (SPLIT) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12" dir={language === 'ur' ? 'rtl' : 'ltr'}>

        {/* Upcoming Programs (8 columns on large screen) */}
        <div className="lg:col-span-8">
          <div className={`flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <h2 className="text-xl font-bold text-[#1F3A5F] flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-[#B08D57]" />
              {language === 'en' ? 'Upcoming Programs & Gatherings' : 'آنے والے پروگرام اور اجتماعات'}
            </h2>
            <Link to="/events" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57]">
              {language === 'en' ? 'View All' : 'سب دیکھیں'}
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 2).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-6">
              {language === 'en' ? 'No scheduled programs.' : 'کوئی طے شدہ پروگرام نہیں ہے۔'}
            </p>
          )}
        </div>

        {/* Contact info card (4 columns on large screen) */}
        <div className={`lg:col-span-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <h2 className="text-xl font-bold text-[#1F3A5F] mb-8 border-b border-[#E5D8CA] pb-3">
            {language === 'en' ? 'Contact Details' : 'رابطے کی تفصیلات'}
          </h2>
          <div className="premium-card p-6 space-y-6 bg-white">
            <p className="text-slate-700 text-xs leading-relaxed font-light">
              {language === 'en' 
                ? `For meetings, invitations, or inquiries, feel free to contact ${heroName}'s office.`
                : `ملاقات، دعوت ناموں یا سوالات کے لیے بلا جھجھک ${heroName} کے دفتر سے رابطہ کریں۔`
              }
            </p>

            <ul className="space-y-4.5 text-sm">
              <li className="flex gap-3 items-start justify-start">
                <MapPin className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-tight font-light">{address}</span>
              </li>
              <li className="flex gap-3 items-center justify-start">
                <Phone className="w-4.5 h-4.5 text-[#B08D57] shrink-0" />
                <span className="text-slate-700 font-light">{phone}</span>
              </li>
              <li className="flex gap-3 items-center justify-start">
                <Mail className="w-4.5 h-4.5 text-[#B08D57] shrink-0" />
                <span className="text-slate-700 font-light">{email}</span>
              </li>
            </ul>

            <Link
              to="/contact"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1F3A5F] hover:bg-[#162C49] text-white text-xs font-bold rounded transition-colors"
            >
              {language === 'en' ? 'Send Message' : 'پیغام بھیجیں'}
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}