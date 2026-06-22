import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertTriangle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { login, clearAuthError } from '../../store/slices/authSlice';
import { useSettings } from '../../../context/SettingsContext';
import { Input } from '../../components/Input';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    dispatch(login({ username, password }));
  };

  return (
    <div className={`bg-[#FAF7F2] dark:bg-slate-950 min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>

      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F3A5F]/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1F3A5F]/5 dark:bg-slate-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-8 relative z-10">

        {/* Logo and Header Banner */}
        <div className="text-center">
          <div className="inline-flex relative mb-4">
            <div className="absolute inset-0 rounded-full bg-[#1F3A5F]/10 dark:bg-emerald-500/10 animate-ping" />
            <div className="relative w-14 h-14 rounded-full bg-[#1F3A5F] dark:bg-slate-900 border border-[#B08D57]/60 dark:border-emerald-500/60 flex items-center justify-center text-[#B08D57] dark:text-[#EAD075]">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1F3A5F] dark:text-slate-100 font-serif tracking-wider">
            {language === 'en' ? 'Admin Login Portal' : 'ایڈمن لاگ ان پورٹل'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-2 font-light">
            {language === 'en' ? 'Login to manage biography, articles, and contacts' : 'باقاعدہ سوانح، مضامین اور روابط کو سنبھالنے کے لیے لاگ ان کریں'}
          </p>
        </div>

        {/* Login Form Card */}
        <div className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-[#E5D8CA]/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none p-8 sm:p-10 ${language === 'ur' ? 'text-right' : 'text-left'}`}>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error Banner */}
            {error && (
              <div className={`bg-red-50 dark:bg-red-950/20 border-r-4 border-red-500 p-4 rounded-md flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{language === 'en' ? 'Error:' : 'خطا:'}</span> {error}
                </div>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold text-[#5C4D3C] dark:text-slate-300 uppercase tracking-wider font-serif ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                {language === 'en' ? 'Username' : 'صارف کا نام (یوزر نیم)'}
              </label>
              <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[#B08D57]/15 dark:focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <User className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} size={18} />
                <Input
                  type="text"
                  required
                  placeholder={language === 'en' ? 'Enter administrator username' : 'ایڈمنسٹریٹر کا یوزر نیم لکھیں'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  inputClassName={`flex-1 min-w-0 bg-transparent border-none outline-none ring-0 shadow-none p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold text-[#5C4D3C] dark:text-slate-300 uppercase tracking-wider font-serif ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                {language === 'en' ? 'Password' : 'پاس ورڈ'}
              </label>
              <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[#B08D57]/15 dark:focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Lock className="text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} size={18} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={language === 'en' ? 'Enter password' : 'پاس ورڈ درج کریں'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputClassName={`flex-1 min-w-0 bg-transparent border-none outline-none ring-0 shadow-none p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors shrink-0"
                  aria-label={showPassword ? (language === 'en' ? 'Hide password' : 'پاس ورڈ چھپائیں') : (language === 'en' ? 'Show password' : 'پاس ورڈ دکھائیں')}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1F3A5F] hover:bg-[#162C49] dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider font-serif text-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>{language === 'en' ? 'Authenticating...' : 'تصدیق کی جا رہی ہے...'}</span>
                  </>
                ) : (
                  <span>{language === 'en' ? 'Login' : 'لاگ ان کریں'}</span>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Back to Homepage Link */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-[#B08D57] dark:hover:text-emerald-400 transition-colors group"
          >
            <span>{language === 'en' ? 'Back to Official Portal' : 'سرکاری پورٹل پر واپس جائیں'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}