import React from 'react';
import { Award, BookOpen, GraduationCap, Briefcase, Bookmark, Milestone } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export default function About() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  // Fallback defaults
  const scholar = settings?.scholarInfo || {};
  const fullName = scholar.fullName || '';
  const title = scholar.title || '';
  const bio = scholar.bio || '';
  const education = scholar.education || { 
    madrasah: language === 'en' ? 'Not Available' : 'دستیاب نہیں', 
    university: language === 'en' ? 'Not Available' : 'دستیاب نہیں' 
  };
  const qualifications = scholar.qualifications || [];
  const expertise = scholar.areasOfExpertise || [];
  const teachingExp = scholar.teachingExperience || '';
  const researchInterests = scholar.researchInterests || [];
  const institutions = scholar.institutionsAssociatedWith || [];
  const achievements = scholar.achievements || [];

  return (
    <div className={`bg-background py-12 transition-colors duration-200 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Biography Header */}
        <div className="premium-card p-8 mb-8 relative overflow-hidden text-start">
          <div className="absolute top-0 left-0 right-0 h-1.5 scholar-gradient-bg"></div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-12 h-12 text-accent dark:text-accent" />
            </div>
            <div className={`text-center ${language === 'ur' ? 'md:text-right' : 'md:text-left'}`}>
              <span className="text-xs font-bold text-accent uppercase tracking-widest font-serif block mb-1">
                {language === 'en' ? "Scholar's Profile" : "عالم کا پروفائل"}
              </span>
              <h1 className="text-3xl font-extrabold text-textPrimary font-serif leading-none tracking-wide">{fullName}</h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 font-serif">{title}</p>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="text-lg font-bold text-textPrimary mb-3 font-serif">
              {language === 'en' ? 'Biography' : 'سوانح حیات'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-light whitespace-pre-line">{bio}</p>
          </div>
        </div>

        {/* Modular Grid Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Qualifications & Education */}
          <div className="premium-card p-6 text-start">
            <h2 className="text-md font-bold text-textPrimary font-serif flex items-center gap-2 mb-4 border-b border-border pb-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              {language === 'en' ? 'Education and Credentials' : 'تعلیم اور اسناد'}
            </h2>
            <div className="space-y-4">
              {education.madrasah && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                    {language === 'en' ? 'Madrasah Education' : 'مدرسہ کی تعلیم'}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-light">{education.madrasah}</span>
                </div>
              )}
              {education.university && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                    {language === 'en' ? 'University Education' : 'یونیورسٹی کی تعلیم'}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-light">{education.university}</span>
                </div>
              )}
              {qualifications.length > 0 && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    {language === 'en' ? 'Qualifications' : 'تعلیمی اسناد'}
                  </span>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 font-light">
                    {qualifications.map((q, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-accent text-md leading-none">•</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Areas of Expertise */}
          <div className="premium-card p-6 text-start">
            <h2 className="text-md font-bold text-textPrimary font-serif flex items-center gap-2 mb-4 border-b border-border pb-2">
              <Award className="w-5 h-5 text-accent" />
              {language === 'en' ? 'Areas of Expertise' : 'مہارت کے شعبے'}
            </h2>
            {expertise.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {expertise.map((e, idx) => (
                  <span key={idx} className="bg-secondary-light dark:bg-slate-800 text-textPrimary dark:text-amber-400 border border-border text-xs font-semibold px-3 py-1.5 rounded-full">
                    {e}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 italic text-xs">
                {language === 'en' ? 'No areas of expertise specified.' : 'مہارت کے کوئی خاص شعبے ترتیب نہیں دیے گئے ہیں۔'}
              </p>
            )}
          </div>

        </div>

        {/* Experience & Associated Institutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Experience */}
          <div className="premium-card p-6 text-start">
            <h2 className="text-md font-bold text-textPrimary font-serif flex items-center gap-2 mb-4 border-b border-border pb-2">
              <Briefcase className="w-5 h-5 text-accent" />
              {language === 'en' ? 'Experience & Achievements' : 'تجربہ اور کامیابیاں'}
            </h2>
            <div className="space-y-4">
              {teachingExp && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                    {language === 'en' ? 'Teaching Experience' : 'تدریسی تجربہ'}
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-light mt-1 leading-relaxed">{teachingExp}</p>
                </div>
              )}
              {achievements.length > 0 && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    {language === 'en' ? 'Key Achievements' : 'اہم کامیابیاں'}
                  </span>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 font-light">
                    {achievements.map((a, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-accent text-md leading-none mt-0.5">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Research & Associations */}
          <div className="premium-card p-6 text-start">
            <h2 className="text-md font-bold text-textPrimary font-serif flex items-center gap-2 mb-4 border-b border-border pb-2">
              <Milestone className="w-5 h-5 text-accent" />
              {language === 'en' ? 'Research & Affiliations' : 'تحقیق اور الحاق'}
            </h2>
            <div className="space-y-4">
              {researchInterests.length > 0 && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    {language === 'en' ? 'Research Interests' : 'تحقیقی دلچسپیاں'}
                  </span>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 font-light">
                    {researchInterests.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-accent text-md leading-none">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {institutions.length > 0 && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    {language === 'en' ? 'Associated Institutions' : 'منسلک ادارے'}
                  </span>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 font-light">
                    {institutions.map((i, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-accent text-md leading-none">•</span> {i}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
