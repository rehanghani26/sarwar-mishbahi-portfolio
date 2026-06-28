import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronDown,
} from 'lucide-react';
import { getArticles, getFatwas, getPublicQuestions, getPublications, getLectures, getEvents } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';

import { ArticleCard, FatwaCard, LectureCard, PublicationCard, EventCard } from '@/components';
import AnimatedFeatureCard from '../components/AnimatedFeatureCard';
import muftiSahebImg from '../../../assets/images/muftiSaheb.png';

function SectionHeading({ eyebrow, title, linkTo, linkLabel }) {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <div className="flex items-end justify-between mb-10 border-b-2 border-border pb-4">
      <div className={`border-accent ${language === 'ur' ? 'border-r-4 pr-4 text-right' : 'border-l-4 pl-4 text-left'}`}>
        <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">
          {eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary leading-none">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-sm font-bold text-primary hover:text-accent flex items-center gap-1 transition-colors">
          {linkLabel} {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Link>
      )}
    </div>
  );
}

function ScholarPhotoPlaceholder() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const name = settings?.scholarInfo?.fullName || '';
  const settingsPhoto = settings?.scholarInfo?.photo || '';

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-accent/40 shadow-none">
        <img
          src={muftiSahebImg}
          alt={name || 'Mufti Saheb'}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            // Fallback chain: local asset failed → try settings URL → hide
            if (settingsPhoto && e.currentTarget.src !== settingsPhoto) {
              e.currentTarget.src = settingsPhoto;
            } else {
              e.currentTarget.style.display = 'none';
            }
          }}
        />
      </div>
    </div>
  );
}

// Static counter for stats
function StaticCounter({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-primary">{value}+</p>
      <p className="text-xs text-textSecondary font-semibold uppercase tracking-widest mt-1">{label}</p>
    </div>
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
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const stats = [
    { value: 500, label: language === 'en' ? 'Articles' : 'مقالات' },
    { value: 1000, label: language === 'en' ? 'Fatwas' : 'فتاویٰ' },
    { value: 300, label: language === 'en' ? 'Lectures' : 'بیانات' },
    { value: 50, label: language === 'en' ? 'Publications' : 'مطبوعات' },
  ];

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
      title: language === 'en' ? 'Authentic Knowledge ' : 'مستند علم',
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
    <div className="bg-background min-h-screen relative overflow-x-hidden">

      {/* 1. HERO SECTION  Testing comments 
      */}
      <section className="scholar-gradient-bg relative overflow-hidden py-20 border-b-2 border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left: Text Content */}
          <div className={`lg:col-span-7 space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <span className="inline-flex items-center gap-1.5 bg-secondary border border-border text-textSecondary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full leading-none whitespace-nowrap max-w-full break-words">
              <span className="text-accent text-sm">✦</span>
              {heroTitle}
            </span>

            {/* Heading */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary leading-snug sm:leading-normal tracking-wide break-words [text-wrap:balance] max-w-2xl">
              {heroName}
            </h1>

            {/* Intro paragraph */}
            <p className="text-textPrimary text-md sm:text-lg font-light leading-relaxed max-w-3xl px-2 sm:px-3 py-1 break-words [overflow-wrap:anywhere]">
              {heroIntro}
            </p>

            {/* Quote */}
            <div className={`border-accent ${language === "ur" ? "border-r-4 pr-4 sm:pr-5 text-right" : "border-l-4 pl-4 sm:pl-5 text-left"} italic text-sm sm:text-base text-textSecondary font-light leading-loose max-w-lg relative p-4 sm:p-5 break-words [overflow-wrap:anywhere]`}>
              {heroMission}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4 justify-start">
              {[
                { to: "/articles", label: language === 'en' ? 'Read Articles' : 'مقالات پڑھیں', icon: FileText, primary: true },
                { to: "/fatwas", label: language === 'en' ? 'View Fatwas' : 'فتاویٰ دیکھیں', icon: BookOpen, primary: false },
              ].map((btn, index) => (
                <div key={index}>
                  <Link
                    to={btn.to}
                    className={`px-6 py-3 ${btn.primary
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg'
                      : 'bg-transparent border-2 border-border text-textSecondary hover:bg-background'
                      } font-bold rounded transition-all flex items-center gap-2 text-sm font-serif leading-none whitespace-nowrap`}
                  >
                    {btn.icon && <btn.icon className="w-4.5 h-4.5" />}
                    {btn.label}
                    {btn.label.includes('Fatwas') && (
                      <span>
                        {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                      </span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right: Scholar Photo */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <ScholarPhotoPlaceholder />
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-textSecondary">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-b border-border bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StaticCounter key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="py-12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop View: Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <AnimatedFeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                to={feature.to}
              />
            </div>
          ))}
        </div>

        {/* Mobile View: Slide One-by-One */}
        <div className="sm:hidden flex flex-col items-center gap-4">
          <div className="w-full">
            <AnimatedFeatureCard
              icon={FEATURES[activeFeatureIndex].icon}
              title={FEATURES[activeFeatureIndex].title}
              description={FEATURES[activeFeatureIndex].description}
              to={FEATURES[activeFeatureIndex].to}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-6 mt-2">
            <button
              type="button"
              disabled={activeFeatureIndex === 0}
              onClick={() => setActiveFeatureIndex(prev => prev - 1)}
              className={`p-2 rounded-full border transition-all ${activeFeatureIndex === 0 ? 'text-slate-300 border-slate-200 cursor-not-allowed' : 'text-primary border-primary hover:bg-slate-50'}`}
            >
              {language === 'ur' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
            
            {/* Dots indicator */}
            <div className="flex items-center gap-2">
              {FEATURES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveFeatureIndex(index)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: activeFeatureIndex === index ? COLORS.primary : COLORS.border,
                    transform: activeFeatureIndex === index ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={activeFeatureIndex === FEATURES.length - 1}
              onClick={() => setActiveFeatureIndex(prev => prev + 1)}
              className={`p-2 rounded-full border transition-all ${activeFeatureIndex === FEATURES.length - 1 ? 'text-slate-300 border-slate-200 cursor-not-allowed' : 'text-primary border-primary hover:bg-slate-50'}`}
            >
              {language === 'ur' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* 2. LATEST ARTICLES */}
      <section className="py-16 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={language === 'en' ? 'PROMOTING KNOWLEDGE' : 'علم کا فروغ'}
          title={language === 'en' ? 'Latest Articles' : 'تازہ ترین مقالات'}
          linkTo="/articles"
          linkLabel={language === 'en' ? 'All Articles' : 'تمام مقالات'}
        />

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <div key={article._id}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">
            {language === 'en' ? 'No articles available.' : 'کوئی مضمون دستیاب نہیں ہے۔'}
          </p>
        )}
      </section>

      {/* 3. FEATURED FATWAS */}
      <section className="bg-background border-y border-border py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={language === 'en' ? 'GUIDANCE & RULINGS' : 'رہنمائی اور احکام'}
            title={language === 'en' ? 'Featured Fatwas' : 'منتخب فتاویٰ'}
            linkTo="/fatwas"
            linkLabel={language === 'en' ? 'All Rulings' : 'تمام احکام'}
          />

          {fatwas && fatwas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fatwas.slice(0, 3).map((fatwa) => (
                <div key={fatwa._id}>
                  <FatwaCard fatwa={fatwa} />
                </div>
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
      <section className="py-16 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={language === 'en' ? 'MUTUAL GUIDANCE' : 'باہمی رہنمائی'}
          title={language === 'en' ? 'Recent Q&A' : 'حالیہ سوال و جواب'}
          linkTo="/qa"
          linkLabel={language === 'en' ? 'All Questions' : 'تمام سوالات'}
        />

        {questions && questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.slice(0, 3).map((q) => (
              <div
                key={q._id}
                className={`premium-card p-6 flex flex-col justify-between h-full bg-white ${language === 'ur' ? 'text-right' : 'text-left'} relative overflow-hidden group`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent" />

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="bg-secondary text-textSecondary font-bold px-2.5 py-1 rounded-full text-[10px]">
                      {q.category}
                    </span>
                    <span>{new Date(q.answeredAt || q.updatedAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}</span>
                  </div>
                  <h4 className="text-md font-bold text-slate-900 mb-2 line-clamp-2">
                    {q.questionTitle}
                  </h4>
                  <p className="text-slate-700 text-xs italic line-clamp-3 mb-4">
                    "{q.detailedQuestion}"
                  </p>
                </div>
                <Link to={`/qa`} className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  {language === 'en' ? 'View Answer' : 'مفتی صاحب کا جواب دیکھیں'}
                  <span>
                    {language === 'en' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">
            {language === 'en' ? 'No answered questions available.' : 'کوئی جواب شدہ سوال دستیاب نہیں ہے۔'}
          </p>
        )}
      </section>

      {/* 5. LATEST PUBLICATIONS */}
      <section className="py-16 bg-white border-t border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={language === 'en' ? 'LIBRARY & ARCHIVE' : 'مطبوعات و رسائل'}
            title={language === 'en' ? 'Latest Publications' : 'تازہ ترین مطبوعات'}
            linkTo="/publications"
            linkLabel={language === 'en' ? 'View All' : 'سب دیکھیں'}
          />

          {publications && publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publications.slice(0, 4).map((pub) => (
                <div key={pub._id}>
                  <PublicationCard publication={pub} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-6">
              {language === 'en' ? 'No publications available.' : 'کوئی مطبوعہ دستیاب نہیں ہے۔'}
            </p>
          )}
        </div>
      </section>

      {/* 6. LATEST LECTURES */}
      <section className="py-16 bg-background border-t border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={language === 'en' ? 'LECTURES & BAYANS' : 'خطبات و بیانات'}
            title={language === 'en' ? 'Latest Lectures' : 'تازہ ترین بیانات'}
            linkTo="/lectures"
            linkLabel={language === 'en' ? 'View All' : 'سب دیکھیں'}
          />

          {lectures && lectures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.slice(0, 3).map((lecture) => (
                <div key={lecture._id}>
                  <LectureCard lecture={lecture} onPlay={() => window.open(lecture.videoUrl, '_blank')} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-6">
              {language === 'en' ? 'No bayans available.' : 'کوئی بیان دستیاب نہیں ہے۔'}
            </p>
          )}
        </div>
      </section>

      {/* 6. EVENTS & CONTACT INFO (SPLIT) */}
      <section className="py-16 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12" dir={language === 'ur' ? 'rtl' : 'ltr'}>

        {/* Upcoming Programs */}
        <div className="lg:col-span-8">
          <div className={`flex items-end justify-between mb-8 border-b border-border pb-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-accent" />
              {language === 'en' ? 'Upcoming Programs & Gatherings' : 'آنے والے پروگرام اور اجتماعات'}
            </h2>
            <Link to="/events" className="text-xs font-bold text-primary hover:text-accent transition-colors">
              {language === 'en' ? 'View All' : 'سب دیکھیں'}
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 2).map((event) => (
                <div key={event._id}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-6">
              {language === 'en' ? 'No scheduled programs.' : 'کوئی طے شدہ پروگرام نہیں ہے۔'}
            </p>
          )}
        </div>

        {/* Contact info card */}
        <div className={`lg:col-span-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <h2 className="text-xl font-bold text-primary mb-8 border-b border-border pb-3">
            {language === 'en' ? 'Contact Details' : 'رابطے کی تفصیلات'}
          </h2>

          <div className="premium-card p-6 space-y-6 bg-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent" />

            <p className="text-slate-700 text-xs leading-relaxed font-light">
              {language === 'en'
                ? `For meetings, invitations, or inquiries, feel free to contact ${heroName}'s office.`
                : `ملاقات، دعوت ناموں یا سوالات کے لیے بلا جھجھک ${heroName} کے دفتر سے رابطہ کریں۔`
              }
            </p>

            <ul className="space-y-4.5 text-sm">
              {[
                { icon: MapPin, text: address },
                { icon: Phone, text: phone },
                { icon: Mail, text: email },
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start justify-start">
                  <item.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-tight font-light">{item.text}</span>
                </li>
              ))}
            </ul>

            <div>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded transition-colors relative overflow-hidden group"
              >
                {language === 'en' ? 'Send Message' : 'پیغام بھیجیں'}
              </Link>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}