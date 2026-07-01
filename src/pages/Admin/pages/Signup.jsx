import { COLORS } from '@/utils/themeColors';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Lock, User, AlertTriangle, ArrowRight, Eye, EyeOff, Mail, Phone, UserPlus } from 'lucide-react';
import { register, clearAuthError } from '../../../store/slices/authSlice';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '../../../components/Input';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error, userRole } = useSelector((state) => state.auth);
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  // Form states
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone number
  const [contactPhone, setContactPhone] = useState(''); // Optional secondary phone
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, userRole, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(clearAuthError());

    // Basic Validation
    if (!name || !identifier || !password || !confirmPassword) {
      setLocalError(language === 'en' ? 'All required fields must be filled.' : 'تمام مطلوبہ خانے پُر کرنا ضروری ہیں۔');
      return;
    }

    if (name.trim().length < 2) {
      setLocalError(language === 'en' ? 'Name must be at least 2 characters.' : 'نام کم از کم 2 حروف پر مشتمل ہونا چاہیے۔');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    const isEmail = emailRegex.test(identifier.trim());
    const isPhone = phoneRegex.test(identifier.trim());

    if (!isEmail && !isPhone) {
      setLocalError(
        language === 'en'
          ? 'Please enter a valid email address or 10-digit phone number starting with 6-9.'
          : 'براہ کرم ایک درست ای میل ایڈریس یا 6-9 سے شروع ہونے والا 10 ہندسوں کا فون نمبر درج کریں۔'
      );
      return;
    }

    if (contactPhone && !phoneRegex.test(contactPhone.trim())) {
      setLocalError(
        language === 'en'
          ? 'Optional contact phone must be a 10-digit number starting with 6-9.'
          : 'اختیاری رابطہ فون نمبر 6-9 سے شروع ہونے والا 10 ہندسوں کا نمبر ہونا چاہیے۔'
      );
      return;
    }

    if (password.length < 6) {
      setLocalError(language === 'en' ? 'Password must be at least 6 characters.' : 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(language === 'en' ? 'Passwords do not match.' : 'پاس ورڈز مطابقت نہیں رکھتے۔');
      return;
    }

    // Dispatch register thunk
    dispatch(
      register({
        name: name.trim(),
        identifier: identifier.trim(),
        contactPhone: contactPhone.trim(),
        password,
      })
    );
  };

  const displayError = localError || error;

  if (isAuthenticated) {
    return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  return (
    <div className={`bg-background dark:bg-slate-950 min-h-[90vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>

      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 dark:bg-slate-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-6 relative z-10">

        {/* Logo and Header Banner */}
        <div className="text-center">
          <div className="inline-flex relative mb-3">
            <div className="relative w-14 h-14 rounded-full bg-primary dark:bg-slate-900 border border-accent/60 dark:border-emerald-500/60 flex items-center justify-center text-accent dark:text-accent">
              <UserPlus className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-primary dark:text-slate-100 font-serif tracking-wider">
            {language === 'en' ? 'Create Account' : 'اکاؤنٹ بنائیں'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-450 mt-1 font-light">
            {language === 'en' ? 'Register to access scholar biography, books, fatwas, and ask queries' : 'عالم صاحب کی سوانح عمری، کتب، فتاویٰ تک رسائی اور سوالات پوچھنے کے لیے رجسٹر کریں'}
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-border/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none p-8 sm:p-10">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error Banner */}
            {displayError && (
              <div className={`bg-red-50 dark:bg-red-950/20 border-r-4 border-red-500 p-4 rounded-md flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs`}>
                <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{language === 'en' ? 'Error:' : 'خطا:'}</span> {displayError}
                </div>
              </div>
            )}

            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-textSecondary dark:text-slate-300 uppercase tracking-wider font-serif">
                {language === 'en' ? 'Full Name *' : 'مکمل نام *'}
              </label>
              <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[COLORS.accent]/15 dark:focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <User className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} size={18} />
                <Input
                  type="text"
                  required
                  placeholder={language === 'en' ? 'Enter your full name' : 'اپنا مکمل نام درج کریں'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  inputClassName={`flex-1 min-w-0 bg-transparent border-none outline-none ring-0 shadow-none p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Identifier Input (Email or Phone) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-textSecondary dark:text-slate-300 uppercase tracking-wider font-serif">
                {language === 'en' ? 'Email or Login Phone *' : 'ای میل یا لاگ ان فون نمبر *'}
              </label>
              <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[COLORS.accent]/15 dark:focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Mail className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} size={18} />
                <Input
                  type="text"
                  required
                  placeholder={language === 'en' ? 'Email or 10-digit phone number' : 'ای میل یا 10 ہندسوں کا فون نمبر'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  inputClassName={`flex-1 min-w-0 bg-transparent border-none outline-none ring-0 shadow-none p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light px-1">
                {language === 'en' 
                  ? 'E.g. user@domain.com or 9876543210 (starts with 6-9)' 
                  : 'مثال: user@domain.com یا 9876543210 (6-9 سے شروع ہونے والا)'}
              </p>
            </div>

            {/* Optional Contact Phone Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-textSecondary dark:text-slate-300 uppercase tracking-wider font-serif">
                {language === 'en' ? 'Contact Phone (Optional)' : 'رابطہ فون نمبر (اختیاری)'}
              </label>
              <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[COLORS.accent]/15 dark:focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Phone className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} size={18} />
                <Input
                  type="text"
                  placeholder={language === 'en' ? 'Enter secondary contact number' : 'ثانوی رابطہ نمبر درج کریں'}
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  inputClassName={`flex-1 min-w-0 bg-transparent border-none outline-none ring-0 shadow-none p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-textSecondary dark:text-slate-300 uppercase tracking-wider font-serif">
                {language === 'en' ? 'Password *' : 'پاس ورڈ *'}
              </label>
              <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[COLORS.accent]/15 dark:focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Lock className="text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} size={18} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={language === 'en' ? 'Create a secure password' : 'مضبوط پاس ورڈ تخلیق کریں'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputClassName={`flex-1 min-w-0 bg-transparent border-none outline-none ring-0 shadow-none p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors shrink-0"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-textSecondary dark:text-slate-300 uppercase tracking-wider font-serif">
                {language === 'en' ? 'Confirm Password *' : 'پاس ورڈ کی تصدیق کریں *'}
              </label>
              <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[COLORS.accent]/15 dark:focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Lock className="text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} size={18} />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder={language === 'en' ? 'Retype password' : 'پاس ورڈ دوبارہ درج کریں'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  inputClassName={`flex-1 min-w-0 bg-transparent border-none outline-none ring-0 shadow-none p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors shrink-0"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary/90 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider font-serif text-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>{language === 'en' ? 'Creating Account...' : 'اکاؤنٹ بنایا جا رہا ہے...'}</span>
                  </>
                ) : (
                  <span>{language === 'en' ? 'Sign Up' : 'رجسٹر کریں'}</span>
                )}
              </button>
            </div>

          </form>

          {/* Toggle login link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {language === 'en' ? 'Already have an account?' : 'پہلے سے ہی ایک اکاؤنٹ ہے؟'}{' '}
            <Link
              to="/admin/login"
              className="text-primary hover:text-accent font-bold transition-colors dark:text-emerald-400"
            >
              {language === 'en' ? 'Login here' : 'یہاں لاگ ان کریں'}
            </Link>
          </div>

        </div>

        {/* Back to Homepage Link */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-accent dark:hover:text-emerald-400 transition-colors group"
          >
            <span>{language === 'en' ? 'Back to Official Portal' : 'سرکاری پورٹل پر واپس جائیں'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}
