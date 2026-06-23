import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { fetchArticles } from '../../../store/slices/contentSlice';
import { fetchFatwas } from '../../../store/slices/contentSlice';
import { fetchPublicQuestions } from '../../../store/slices/contentSlice';
import { fetchPublications } from '../../../store/slices/contentSlice';
import { fetchLectures } from '../../../store/slices/contentSlice';
import { fetchEvents } from '../../../store/slices/contentSlice';
import { fetchSettings } from '../../../store/slices/settingsSlice';
import muftiSahed from '../../../asset/muftiSahed.png';

import ArticleCard from '../../../components/ArticleCard';
import FatwaCard from '../../../components/FatwaCard';
import LectureCard from '../../../components/LectureCard';
import PublicationCard from '../../../components/PublicationCard';
import EventCard from '../../../components/EventCard';
import AnimatedFeatureCard from './Animatedfeaturecard ';

// Enhanced SectionHeading with more animations
function SectionHeading({ eyebrow, title, linkTo, linkLabel, delay = 0 }) {
  const { settings } = useSelector((state) => state.settings);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        damping: 12,
        stiffness: 100
      }}
      className="flex items-end justify-between mb-10 border-b-2 border-[#E5D8CA] pb-4 relative overflow-hidden"
    >
      {/* Animated background line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
        className="absolute bottom-0 left-0 h-[3px] bg-[#B08D57] origin-left"
        style={{ width: '30%' }}
      />

      <div className={`border-[#B08D57] ${language === 'ur' ? 'border-r-4 pr-4 text-right' : 'border-l-4 pl-4 text-left'} relative`}>
        <motion.span
          initial={{ opacity: 0, x: language === 'ur' ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
          className="text-xs font-bold text-[#B08D57] uppercase tracking-widest block mb-1 flex items-center gap-2"
        >
          <Sparkles className="w-3 h-3 animate-pulse" />
          {eyebrow}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + 0.2,
            type: "spring",
            damping: 10,
            stiffness: 120
          }}
          className="text-2xl sm:text-3xl font-extrabold text-[#1F3A5F] leading-none"
        >
          {title}
        </motion.h2>
      </div>

      {linkTo && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={linkTo}
            className="text-sm font-bold text-[#1F3A5F] hover:text-[#B08D57] flex items-center gap-1 transition-colors group"
          >
            {linkLabel}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
            >
              {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </motion.span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

// Enhanced ScholarPhotoPlaceholder with floating animation
function ScholarPhotoPlaceholder() {
  const { settings } = useSelector((state) => state.settings);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: 0,
        y: [0, -10, 0],
      }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border border-[#E5D8CA] bg-white shadow-2xl"
    >
      {/* Animated glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-tr from-[#B08D57]/10 to-[#1F3A5F]/10 rounded-2xl"
      />

      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full"
      >
        <img
          src={muftiSahed}
          alt={language === 'en' ? 'Scholar Portrait' : 'عالم صاحب کی تصویر'}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Animated border frame */}
      <motion.div
        animate={{
          borderColor: ['#E5D8CA', '#B08D57', '#E5D8CA'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
      />
    </motion.div>
  );
}

// Animated background particles component
function AnimatedParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            opacity: 0
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 0.5, 0],
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-[#B08D57] rounded-full"
        />
      ))}
    </div>
  );
}

// Animated counter component
function AnimatedCounter({ value, label }) {
  const [count, setCount] = React.useState(0);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 2000;
        const increment = value / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, { threshold: 0.5 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <motion.div
        animate={{ scale: count > 0 ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-bold text-[#1F3A5F]"
      >
        {count}+
      </motion.div>
      <div className="text-sm text-[#7B654D]">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values for scroll effects
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0.3]);
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);
  const headerY = useTransform(smoothProgress, [0, 0.2], [0, -50]);

  // Redux Selectors
  const { settings } = useSelector((state) => state.settings);
  const { list: articles } = useSelector((state) => state.content.articles);
  const { list: fatwas } = useSelector((state) => state.content.fatwas);
  const { publicList: questions } = useSelector((state) => state.content.questions);
  const { list: publications } = useSelector((state) => state.content.publications);
  const { list: lectures } = useSelector((state) => state.content.lectures);
  const { list: events } = useSelector((state) => state.content.events);

  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

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

  const stats = [
    { value: 50, label: language === 'en' ? 'Articles' : 'مقالات' },
    { value: 30, label: language === 'en' ? 'Fatwas' : 'فتاویٰ' },
    { value: 100, label: language === 'en' ? 'Questions' : 'سوالات' },
    { value: 20, label: language === 'en' ? 'Lectures' : 'بیانات' },
  ];

  return (
    <div className="bg-site-bg min-h-screen relative overflow-x-hidden">

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#B08D57] z-50"
        style={{ scaleX: smoothProgress, transformOrigin: '0%' }}
      />

      {/* 1. HERO SECTION — Enhanced with heavy animations */}
      <motion.section
        style={{
          opacity: heroOpacity,
          scale: heroScale,
        }}
        className="scholar-gradient-bg relative overflow-hidden py-20 border-b-2 border-[#E5D8CA]"
      >
        <AnimatedParticles />

        {/* Floating decorative elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-10 w-32 h-32 border border-[#B08D57]/10 rounded-full pointer-events-none"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-10 left-10 w-24 h-24 border border-[#B08D57]/10 rounded-full pointer-events-none"
        />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left: Text Content */}
          <motion.div
            className={`lg:col-span-7 space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              damping: 12,
              stiffness: 100
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                type: "spring",
                damping: 15
              }}
              className="inline-flex items-center gap-1.5 bg-[#F5EEE5] border border-[#E5D8CA] text-[#7B654D] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full leading-none whitespace-nowrap max-w-full break-words"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-[#B08D57] text-sm"
              >
                ✦
              </motion.span>
              {heroTitle}
            </motion.span>

            {/* Heading: balanced wrap + breathing room between wrapped lines */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                type: "spring",
                damping: 10,
                stiffness: 120
              }}
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1F3A5F] leading-snug sm:leading-normal tracking-wide break-words [text-wrap:balance] max-w-2xl"
            >
              {heroName}
            </motion.h1>

            {/* Intro paragraph: generous line-height + responsive padding so wrapped lines breathe */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                type: "spring",
                damping: 12,
                stiffness: 100,
              }}
              className="text-[#2C2C2C] text-md sm:text-lg font-light leading-[calc(1em+2rem)] max-w-3xl px-2 sm:px-3 py-1 break-words [overflow-wrap:anywhere] hyphens-auto"
            >
              {heroIntro}
            </motion.p>

            {/* Quote: extra line-height so the 2nd wrapped line gets clear separation from the 1st */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                type: "spring",
                damping: 12,
                stiffness: 100,
              }}
              className={`border-[#B08D57] ${language === "ur"
                ? "border-r-4 pr-4 sm:pr-5 text-right"
                : "border-l-4 pl-4 sm:pl-5 text-left"
                } italic text-sm sm:text-base text-[#7B654D] font-light leading-loose max-w-lg relative p-4 sm:p-5 break-words [overflow-wrap:anywhere]`}
            >
              <motion.div
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute ${language === "ur" ? "right-0" : "left-0"
                  } top-0 w-1 h-full bg-[#B08D57]`}
              />
              "{heroMission}"
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.7,
                type: "spring",
                damping: 12,
                stiffness: 100
              }}
              className="flex flex-wrap items-center gap-4 pt-4 justify-start"
            >
              {[
                { to: "/ask", label: language === 'en' ? 'Ask Question' : 'سوال پوچھیں', icon: HelpCircle, primary: true },
                { to: "/articles", label: language === 'en' ? 'Read Articles' : 'مقالات پڑھیں', icon: FileText, primary: false },
                { to: "/fatwas", label: language === 'en' ? 'View Fatwas' : 'فتاویٰ دیکھیں', icon: null, primary: false },
              ].map((btn, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Link
                    to={btn.to}
                    className={`px-6 py-3 ${btn.primary
                      ? 'bg-[#1F3A5F] hover:bg-[#162C49] text-white shadow-md hover:shadow-lg'
                      : btn.label.includes('Fatwas')
                        ? 'bg-transparent hover:underline text-[#7B654D] hover:text-[#1F3A5F]'
                        : 'bg-transparent border-2 border-[#E5D8CA] text-[#7B654D] hover:bg-[#FAF7F2]'
                      } font-bold rounded transition-all flex items-center gap-2 text-sm font-serif leading-none whitespace-nowrap`}
                  >
                    {btn.icon && <btn.icon className="w-4.5 h-4.5" />}
                    {btn.label}
                    {btn.label.includes('Fatwas') && (
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                      >
                        {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Right: Scholar Photo with enhanced animations */}
          <motion.div
            className="lg:col-span-5 flex justify-center w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: "spring",
              damping: 12,
              stiffness: 100
            }}
          >
            <ScholarPhotoPlaceholder />
          </motion.div>

        </div>

        {/* Scroll down indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-[#7B654D]"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.section>
      {/* Stats Section */}
      <motion.section
        className="py-8 border-b border-[#E5D8CA] bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedCounter key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* FEATURE CARDS SECTION — enhanced animations */}
      <motion.section
        className="py-12 mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                type: "spring",
                damping: 12,
                stiffness: 100
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <AnimatedFeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                to={feature.to}
                index={i}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 2. LATEST ARTICLES */}
      <motion.section
        className="py-16 mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          eyebrow={language === 'en' ? 'PROMOTING KNOWLEDGE' : 'علم کا فروغ'}
          title={language === 'en' ? 'Latest Articles' : 'تازہ ترین مقالات'}
          linkTo="/articles"
          linkLabel={language === 'en' ? 'All Articles' : 'تمام مقالات'}
        />

        <AnimatePresence>
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 3).map((article, index) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    damping: 12,
                    stiffness: 100
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-400 italic text-center py-6"
            >
              {language === 'en' ? 'No articles available.' : 'کوئی مضمون دستیاب نہیں ہے۔'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 3. FEATURED FATWAS */}
      <motion.section
        className="bg-[#FAF7F2] border-y border-[#E5D8CA] py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={language === 'en' ? 'GUIDANCE & RULINGS' : 'رہنمائی اور احکام'}
            title={language === 'en' ? 'Featured Fatwas' : 'منتخب فتاویٰ'}
            linkTo="/fatwas"
            linkLabel={language === 'en' ? 'All Rulings' : 'تمام احکام'}
            delay={0.1}
          />

          <AnimatePresence>
            {fatwas && fatwas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fatwas.slice(0, 3).map((fatwa, index) => (
                  <motion.div
                    key={fatwa._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      type: "spring",
                      damping: 12,
                      stiffness: 100
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <FatwaCard fatwa={fatwa} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 italic text-center py-6"
              >
                {language === 'en' ? 'No fatwas available.' : 'کوئی فتویٰ دستیاب نہیں ہے۔'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* 4. RECENT Q&A */}
      <motion.section
        className="py-16 mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          eyebrow={language === 'en' ? 'MUTUAL GUIDANCE' : 'باہمی رہنمائی'}
          title={language === 'en' ? 'Recent Q&A' : 'حالیہ سوال و جواب'}
          linkTo="/qa"
          linkLabel={language === 'en' ? 'All Questions' : 'تمام سوالات'}
          delay={0.2}
        />

        <AnimatePresence>
          {questions && questions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.slice(0, 3).map((q, i) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    type: "spring",
                    damping: 12,
                    stiffness: 100
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className={`premium-card p-6 flex flex-col justify-between h-full bg-white ${language === 'ur' ? 'text-right' : 'text-left'} relative overflow-hidden group`}
                >
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B08D57] via-[#1F3A5F] to-[#B08D57]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <motion.span
                        className="bg-[#E5D8CA] text-[#7B654D] font-bold px-2.5 py-1 rounded-full text-[10px]"
                        whileHover={{ scale: 1.05 }}
                      >
                        {q.category}
                      </motion.span>
                      <span>{new Date(q.answeredAt || q.updatedAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}</span>
                    </div>
                    <h4 className="text-md font-bold text-slate-900 mb-2 line-clamp-2">
                      {q.questionTitle}
                    </h4>
                    <p className="text-slate-700 text-xs italic line-clamp-3 mb-4">
                      "{q.detailedQuestion}"
                    </p>
                  </div>
                  <Link to={`/qa`} className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57] flex items-center gap-1 group-hover:gap-2 transition-all">
                    {language === 'en' ? 'View Answer' : 'مفتی صاحب کا جواب دیکھیں'}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                    >
                      {language === 'en' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-400 italic text-center py-6"
            >
              {language === 'en' ? 'No answered questions available.' : 'کوئی جواب شدہ سوال دستیاب نہیں ہے۔'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 5. LATEST PUBLICATIONS & LECTURES (SPLIT SECTION) */}
      <motion.section
        className="bg-[#FAF7F2] border-t border-[#E5D8CA] py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12" dir={language === 'ur' ? 'rtl' : 'ltr'}>

          {/* Left: Publications */}
          <motion.div
            className={language === 'ur' ? 'text-right' : 'text-left'}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              type: "spring",
              damping: 12,
              stiffness: 100
            }}
          >
            <motion.div
              className={`flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <motion.h2
                className="text-xl font-bold text-[#1F3A5F] flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <Book className="w-5.5 h-5.5 text-[#B08D57]" />
                {language === 'en' ? 'Latest Publications' : 'تازہ ترین مطبوعات'}
              </motion.h2>
              <Link to="/publications" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57] transition-colors">
                {language === 'en' ? 'View All' : 'سب دیکھیں'}
              </Link>
            </motion.div>

            {publications && publications.length > 0 ? (
              <div className="space-y-4">
                {publications.slice(0, 2).map((pub, index) => (
                  <motion.div
                    key={pub._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: language === 'ur' ? -8 : 8 }}
                  >
                    <PublicationCard publication={pub} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 italic text-center py-6"
              >
                {language === 'en' ? 'No publications available.' : 'کوئی مطبوعہ دستیاب نہیں ہے۔'}
              </motion.p>
            )}
          </motion.div>

          {/* Right: Lectures */}
          <motion.div
            className={language === 'ur' ? 'text-right' : 'text-left'}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              type: "spring",
              damping: 12,
              stiffness: 100
            }}
          >
            <motion.div
              className={`flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.h2
                className="text-xl font-bold text-[#1F3A5F] flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <Play className="w-5.5 h-5.5 text-[#B08D57] fill-current" />
                {language === 'en' ? 'Latest Lectures' : 'تازہ ترین بیانات'}
              </motion.h2>
              <Link to="/lectures" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57] transition-colors">
                {language === 'en' ? 'View All' : 'سب دیکھیں'}
              </Link>
            </motion.div>

            {lectures && lectures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lectures.slice(0, 2).map((lecture, index) => (
                  <motion.div
                    key={lecture._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <LectureCard lecture={lecture} onPlay={() => window.open(lecture.videoUrl, '_blank')} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 italic text-center py-6"
              >
                {language === 'en' ? 'No bayans available.' : 'کوئی بیان دستیاب نہیں ہے۔'}
              </motion.p>
            )}
          </motion.div>

        </div>
      </motion.section>

      {/* 6. EVENTS & CONTACT INFO (SPLIT) */}
      <motion.section
        className="py-16 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12"
        dir={language === 'ur' ? 'rtl' : 'ltr'}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >

        {/* Upcoming Programs (8 columns on large screen) */}
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className={`flex items-end justify-between mb-8 border-b border-[#E5D8CA] pb-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <h2 className="text-xl font-bold text-[#1F3A5F] flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-[#B08D57]" />
              {language === 'en' ? 'Upcoming Programs & Gatherings' : 'آنے والے پروگرام اور اجتماعات'}
            </h2>
            <Link to="/events" className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57] transition-colors">
              {language === 'en' ? 'View All' : 'سب دیکھیں'}
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 2).map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: language === 'ur' ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-400 italic text-center py-6"
            >
              {language === 'en' ? 'No scheduled programs.' : 'کوئی طے شدہ پروگرام نہیں ہے۔'}
            </motion.p>
          )}
        </motion.div>

        {/* Contact info card (4 columns on large screen) */}
        <motion.div
          className={`lg:col-span-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2
            className="text-xl font-bold text-[#1F3A5F] mb-8 border-b border-[#E5D8CA] pb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {language === 'en' ? 'Contact Details' : 'رابطے کی تفصیلات'}
          </motion.h2>

          <motion.div
            className="premium-card p-6 space-y-6 bg-white relative overflow-hidden group"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B08D57] via-[#1F3A5F] to-[#B08D57]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />

            <motion.p
              className="text-slate-700 text-xs leading-relaxed font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {language === 'en'
                ? `For meetings, invitations, or inquiries, feel free to contact ${heroName}'s office.`
                : `ملاقات، دعوت ناموں یا سوالات کے لیے بلا جھجھک ${heroName} کے دفتر سے رابطہ کریں۔`
              }
            </motion.p>

            <ul className="space-y-4.5 text-sm">
              {[
                { icon: MapPin, text: address },
                { icon: Phone, text: phone },
                { icon: Mail, text: email },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex gap-3 items-start justify-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <item.icon className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-tight font-light">{item.text}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            >
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1F3A5F] hover:bg-[#162C49] text-white text-xs font-bold rounded transition-colors relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {language === 'en' ? 'Send Message' : 'پیغام بھیجیں'}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

      </motion.section>

    </div>
  );
}