import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, BookOpen, User, HelpCircle, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { fetchSettings } from '../store/slices/settingsSlice';
import useTranslate from '../hooks/useTranslate';

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  const { isAuthenticated } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.settings);
  const { t, isUrdu } = useTranslate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Scholar', href: '/about' },
    { label: 'Articles', href: '/articles' },
    { label: 'Fatwas', href: '/fatwas' },
    { label: 'Q&As', href: '/qa' },
    { label: 'Publications', href: '/publications' },
    { label: 'Lectures', href: '/lectures' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
  ];

  const scholarName = t(settings?.scholarInfo?.fullName || '');
  const scholarTitle = t(settings?.scholarInfo?.title || '');

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-card-bg shadow-md border-b border-site-border py-2'
          : 'bg-site-bg/95 border-b border-site-border/55 backdrop-blur-xs py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between" dir={isUrdu ? 'rtl' : 'ltr'}>
        
        {/* Scholar Branding / Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-brown-dark flex items-center justify-center shadow-md">
            {/* Calligraphy seal or book icon representing knowledge */}
            <BookOpen className="w-5 h-5 text-[#B08D57]" />
          </div>
          <div className="text-left">
            <span className="block text-lg font-bold text-text-primary leading-none tracking-wide">
              {isUrdu ? scholarName : scholarName.toUpperCase()}
            </span>
            <span className="block text-[11px] text-brown-mid dark:text-amber-400/90 font-semibold mt-0.5 font-serif">
              {scholarTitle}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              (link.href !== '/' && location.pathname.startsWith(link.href));

            return (
              <Link
                key={link.label}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brown-dark font-bold border-b-2 border-brown-dark'
                    : 'text-text-secondary hover:text-[#B08D57]'
                }`}
              >
                {t(link.label)}
              </Link>
            );
          })}
        </nav>

        {/* Right side CTA & Admin indicators */}
        <div className="hidden lg:flex items-center gap-3">

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brown-dark hover:bg-[#162C49] rounded transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-brown-mid" />
                {t('Dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/30 rounded border border-red-200 dark:border-red-900/30 transition-colors"
                title={t('Logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/ask"
              className="flex items-center gap-1.5 px-4.5 py-2 text-sm font-bold text-white bg-brown-dark hover:bg-[#162C49] rounded-full shadow-sm hover:shadow-md transition-all font-serif"
            >
              <HelpCircle className="w-4 h-4" />
              {t('Ask Question')}
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center lg:hidden gap-2">

          {!isAuthenticated && (
            <Link
              to="/ask"
              className="px-3 py-1.5 text-xs font-bold text-white bg-brown-dark hover:bg-[#162C49] rounded-full shadow-sm transition-all"
            >
              {t('Ask Q')}
            </Link>
          )}
          <button
            onClick={toggleMenu}
            className="p-1.5 rounded text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" onClick={closeMenu}>
          <div
            className={`fixed top-0 ${isUrdu ? 'left-0 border-r' : 'right-0 border-l'} h-full w-[280px] bg-card-bg shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 transform border-site-border`}
            onClick={(e) => e.stopPropagation()}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-site-border">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-text-primary" />
                  <span className="font-bold text-text-primary text-md">{t('Navigation')}</span>
                </div>
                <button onClick={closeMenu} className="p-1 rounded text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive =
                    location.pathname === link.href ||
                    (link.href !== '/' && location.pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={closeMenu}
                      className={`px-3 py-2.5 rounded text-base font-medium transition-all ${
                        isActive
                          ? 'bg-[#E5D8CA] text-[#1F3A5F] font-bold'
                          : 'text-text-secondary hover:bg-slate-50 hover:text-[#B08D57]'
                      }`}
                    >
                      {t(link.label)}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-site-border flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-white bg-brown-dark hover:bg-[#162C49] rounded"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#B08D57]" />
                    {t('Admin Dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('Logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-text-secondary bg-slate-100 hover:bg-slate-200 hover:text-[#1F3A5F] rounded border border-site-border"
                >
                  <User className="w-4 h-4" />
                  {t('Admin Login')}
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
