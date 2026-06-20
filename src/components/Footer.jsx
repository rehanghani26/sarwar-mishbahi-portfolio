import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BookOpen, Mail, Phone, MapPin, Send, Facebook, Youtube, Twitter, Instagram, Shield } from 'lucide-react';
import useTranslate from '../hooks/useTranslate';
import { Input } from './Input';

export default function Footer() {
  const { settings } = useSelector((state) => state.settings);
  const { t, isUrdu } = useTranslate();

  const scholarName = settings?.scholarInfo?.fullName || 'Dr. Islamic Scholar';
  const scholarTitle = settings?.scholarInfo?.title || 'Mufti & Educator';
  
  const address = settings?.contactInfo?.address || 'Islamic Center, Knowledge Dist.';
  const phone = settings?.contactInfo?.phone || '+1 (800) 555-ISLAM';
  const whatsapp = settings?.contactInfo?.whatsapp || '+1 (800) 555-WHATS';
  const email = settings?.contactInfo?.email || 'scholar@islamicknowledge.com';

  const socialLinks = settings?.socialLinks || {};

  return (
    <footer className="bg-[#FAF7F2] text-[#2C2C2C] islamic-pattern relative border-t-2 border-[#E5D8CA] pt-16 pb-8">
      {/* Metallic Gold Accent Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#B08D57]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" dir={isUrdu ? 'rtl' : 'ltr'}>
        
        {/* Column 1: Biography / Mission */}
        <div className={isUrdu ? 'text-right' : 'text-left'}>
          <div className="flex items-center gap-2 mb-4 justify-start">
            <BookOpen className="w-6 h-6 text-[#1F3A5F]" />
            <span className="text-lg font-bold text-[#1F3A5F] tracking-wide font-serif">
              {isUrdu ? scholarName : scholarName.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-[#7B654D] leading-relaxed mb-4 font-light">
            {settings?.homepageSettings?.heroMission || t('Dedicated to making authentic Islamic knowledge accessible, accurate, and actionable in accordance with traditional classical scholarship.')}
          </p>
          <div className="flex items-center gap-2.5 justify-start">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-white text-[#1F3A5F] border border-[#E5D8CA] hover:bg-[#B08D57] hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-white text-[#1F3A5F] border border-[#E5D8CA] hover:bg-[#B08D57] hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-white text-[#1F3A5F] border border-[#E5D8CA] hover:bg-[#B08D57] hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-white text-[#1F3A5F] border border-[#E5D8CA] hover:bg-[#B08D57] hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Sitemap Navigation */}
        <div className={isUrdu ? 'text-right' : 'text-left'}>
          <h3 className="text-[#1F3A5F] font-semibold text-md mb-4 border-b border-[#E5D8CA] pb-2 font-serif uppercase tracking-wider">
            {t('Quick Links')}
          </h3>
          <ul className="space-y-2.5 text-sm font-light">
            <li>
              <Link to="/about" className="text-[#7B654D] hover:text-[#1F3A5F] hover:underline transition-all flex items-center gap-1 justify-start">
                <span className="text-[#B08D57]">›</span> {t('Biography & Qualifications')}
              </Link>
            </li>
            <li>
              <Link to="/articles" className="text-[#7B654D] hover:text-[#1F3A5F] hover:underline transition-all flex items-center gap-1 justify-start">
                <span className="text-[#B08D57]">›</span> {t('Scholarly Articles')}
              </Link>
            </li>
            <li>
              <Link to="/fatwas" className="text-[#7B654D] hover:text-[#1F3A5F] hover:underline transition-all flex items-center gap-1 justify-start">
                <span className="text-[#B08D57]">›</span> {t('Fatwas & Rulings')}
              </Link>
            </li>
            <li>
              <Link to="/qa" className="text-[#7B654D] hover:text-[#1F3A5F] hover:underline transition-all flex items-center gap-1 justify-start">
                <span className="text-[#B08D57]">›</span> {t('Questions & Answers')}
              </Link>
            </li>
            <li>
              <Link to="/publications" className="text-[#7B654D] hover:text-[#1F3A5F] hover:underline transition-all flex items-center gap-1 justify-start">
                <span className="text-[#B08D57]">›</span> {t('Books & Studies')}
              </Link>
            </li>
            <li>
              <Link to="/lectures" className="text-[#7B654D] hover:text-[#1F3A5F] hover:underline transition-all flex items-center gap-1 justify-start">
                <span className="text-[#B08D57]">›</span> {t('Video & Audio Bayans')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div className={isUrdu ? 'text-right' : 'text-left'}>
          <h3 className="text-[#1F3A5F] font-semibold text-md mb-4 border-b border-[#E5D8CA] pb-2 font-serif uppercase tracking-wider">
            {t('Contact Scholar')}
          </h3>
          <ul className="space-y-3.5 text-sm font-light">
            <li className="flex items-start gap-2.5 justify-start">
              <MapPin className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
              <span className="text-[#2C2C2C] leading-tight">{address}</span>
            </li>
            <li className="flex items-center gap-2.5 justify-start">
              <Phone className="w-4 h-4 text-[#B08D57] shrink-0" />
              <span className="text-[#2C2C2C]">{phone}</span>
            </li>
            {whatsapp && (
              <li className="flex items-center gap-2.5 justify-start">
                <span className="text-[#7B654D] font-bold text-xs bg-[#E5D8CA] rounded px-2 py-0.5 border border-[#E5D8CA]">{t('WhatsApp')}</span>
                <span className="text-[#2C2C2C]">{whatsapp}</span>
              </li>
            )}
            <li className="flex items-center gap-2.5 justify-start">
              <Mail className="w-4 h-4 text-[#B08D57] shrink-0" />
              <span className="text-[#2C2C2C]">{email}</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter Submission Mock */}
        <div className={isUrdu ? 'text-right' : 'text-left'}>
          <h3 className="text-[#1F3A5F] font-semibold text-md mb-4 border-b border-[#E5D8CA] pb-2 font-serif uppercase tracking-wider">
            {t('Stay Updated')}
          </h3>
          <p className="text-xs text-[#7B654D] mb-4 font-light leading-relaxed">
            {t('Subscribe to receive direct notifications when new Islamic articles, publications, or fatwas are posted.')}
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex border border-[#E5D8CA] rounded overflow-hidden shadow-xs" dir="ltr">
            <Input
              type="email"
              placeholder={t('Your email address')}
              border=""
              inputClassName="bg-white text-slate-800 text-xs px-3 py-2 w-full outline-none"
            />
            <button
              type="submit"
              className="bg-[#1F3A5F] hover:bg-[#162C49] text-white px-4 transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Footer base metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#E5D8CA] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500" dir={isUrdu ? 'rtl' : 'ltr'}>
        <p className="mb-4 sm:mb-0 text-center sm:text-left">
          &copy; {new Date().getFullYear()} {scholarName}. {t('All Rights Reserved. Derived from classical guidelines.')}
        </p>
        <div className="flex items-center gap-4">
          <Link to="/admin/login" className="hover:text-[#B08D57] transition-colors flex items-center gap-1 font-semibold text-[#1F3A5F]">
            <Shield className="w-3.5 h-3.5" /> {t('Admin Panel')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
